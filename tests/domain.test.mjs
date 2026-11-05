import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, questions, scores, priorities, isComplete, seedRecords, validRecord } from '../dist/domain.mjs';
const answers = value => Object.fromEntries(questions.map(q => [q.id, value]));
test('15 questions across five equally weighted categories', () => {
  assert.equal(categories.length, 5);assert.equal(questions.length,15);
  assert.equal(scores(answers(0)).total,0);assert.equal(scores(answers(100)).total,100);
  const mixed=answers(0);questions.filter(q=>q.category==='energy').forEach(q=>mixed[q.id]=100);
  assert.equal(scores(mixed).total,20);
});
test('incomplete and invalid values cannot receive a score',()=>{
  const a=answers(50);delete a['water-1'];assert.equal(isComplete(a),false);assert.throws(()=>scores(a));
  a['water-1']='50';assert.equal(isComplete(a),false);a['water-1']=30;assert.equal(isComplete(a),false);
});
test('priorities choose lowest values, preserve ties, and exclude good practices',()=>{
  const a=answers(100);a['energy-0']=50;a['water-0']=0;a['waste-0']=0;a['paper-0']=50;
  assert.deepEqual(priorities(a).map(q=>q.id),['water-0','waste-0','energy-0']);assert.equal(priorities(answers(100)).length,0);
});
test('seed uses three previous months across year boundary with valid records',()=>{
  const demo=seedRecords('2026-01');assert.deepEqual(demo.map(r=>r.month),['2025-10','2025-11','2025-12']);
  assert.ok(demo.every(validRecord));assert.equal(Math.round(scores(demo[2].answers).total),67);
});
test('completed actions do not change score',()=>{
  const r=seedRecords('2026-11')[2];const total=scores(r.answers).total;r.completed.push(priorities(r.answers)[0].id);
  assert.equal(scores(r.answers).total,total);assert.ok(validRecord(r));assert.equal(validRecord({...r,month:'2026-99'}),false);
});
