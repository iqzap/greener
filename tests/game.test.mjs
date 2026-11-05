import test from 'node:test';
import assert from 'node:assert/strict';
import { gameStats } from '../dist/game.mjs';
import { seedRecords, priorities, scores } from '../dist/domain.mjs';

test('XP comes from one monthly assessment and completed actions, independently of score', () => {
  const records=seedRecords('2026-11');
  assert.equal(gameStats(records).xp,150);
  const last=records.at(-1), originalScore=scores(last.answers).total;
  last.completed.push(priorities(last.answers)[0].id);
  assert.equal(gameStats(records).xp,160);
  assert.equal(scores(last.answers).total,originalScore);
  last.completed=[];
  assert.equal(gameStats(records).xp,150);
});
test('editing the same month cannot farm assessment XP', () => {
  const records=seedRecords('2026-11'), originalXP=gameStats(records).xp;
  const edited={...records[0],answers:{...records[0].answers,'energy-0':100}};
  records[0]=edited;
  assert.equal(gameStats(records).xp,originalXP);
});
test('levels have deterministic thresholds and no invented activity', () => {
  assert.deepEqual(gameStats([]),{xp:0,completed:0,level:1,title:'Penjelajah hijau',next:150});
  assert.equal(gameStats(seedRecords('2026-11')).level,2);
});
