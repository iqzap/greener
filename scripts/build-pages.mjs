import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else files.push(path);
  }
  return files.sort();
}

export async function buildPages({ source = join(root, 'dist'), output = join(root, 'build/pages') } = {}) {
  if (resolve(source) === resolve(output)) throw new Error('Build output must differ from source.');
  const files = await filesIn(source);
  const hash = createHash('sha256');
  for (const file of files) hash.update(relative(source, file)).update('\0').update(await readFile(file));
  const version = hash.digest('hex').slice(0, 16);

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(source, output, { recursive: true });
  for (const file of files) {
    const name = relative(source, file);
    if (!/\.(?:html|m?js)$/.test(name)) continue;
    let content = await readFile(file, 'utf8');
    if (name.endsWith('.html')) {
      content = content.replace(/((?:src|href)=["'])(\.\/[^"'?#]+\.(?:m?js|css))(["'])/g, `$1$2?v=${version}$3`);
    } else {
      content = content.replace(/(\b(?:from|import)\s*["'])(\.{1,2}\/[^"'?#]+\.m?js)(["'])/g, `$1$2?v=${version}$3`);
    }
    await writeFile(join(output, name), content);
  }
  return version;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`GitHub Pages release: ${await buildPages()}`);
}
