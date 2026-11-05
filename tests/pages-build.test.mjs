import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildPages } from '../scripts/build-pages.mjs';

test('Pages versions entry files and every local module with the same release', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'greener-pages-'));
  try {
    const source = join(directory, 'source'), output = join(directory, 'output');
    await mkdir(source);
    await writeFile(join(source, 'index.html'), '<link href="./styles.css"><script type="module" src="./app.js"></script>');
    await writeFile(join(source, 'app.js'), "import { value } from './model.mjs';\nconsole.log(value);");
    await writeFile(join(source, 'model.mjs'), "import './shared.mjs';\nexport const value = 1;");
    await writeFile(join(source, 'shared.mjs'), 'export const shared = true;');
    await writeFile(join(source, 'styles.css'), 'body { color: green; }');
    const first = await buildPages({ source, output });
    const html = await readFile(join(output, 'index.html'), 'utf8');
    assert.ok(html.includes(`src="./app.js?v=${first}"`));
    assert.ok(html.includes(`href="./styles.css?v=${first}"`));
    assert.ok((await readFile(join(output, 'app.js'), 'utf8')).includes(`./model.mjs?v=${first}`));
    assert.ok((await readFile(join(output, 'model.mjs'), 'utf8')).includes(`./shared.mjs?v=${first}`));
    assert.equal(await buildPages({ source, output }), first);
    await writeFile(join(source, 'shared.mjs'), 'export const shared = false;');
    assert.notEqual(await buildPages({ source, output }), first);
    assert.ok(!(await readFile(join(source, 'app.js'), 'utf8')).includes('?v='));
  } finally { await rm(directory, { recursive: true, force: true }); }
});
