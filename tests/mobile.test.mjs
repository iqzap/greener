import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, seedRecords } from '../dist/domain.mjs';
import { nextUnanswered, questionIndex, questionCopy } from '../dist/mobile.mjs';

test('resume uses the first unanswered question, including a zero-valued answer', () => {
  assert.equal(nextUnanswered({}),0);
  assert.equal(nextUnanswered({[questions[0].id]:0,[questions[1].id]:50}),2);
  assert.equal(nextUnanswered(seedRecords('2026-11')[0].answers),0);
});
test('question links stay bounded and old category links still work', () => {
  assert.equal(questionIndex('15',{}),14);
  assert.equal(questionIndex('transport',{}),12);
  assert.equal(questionIndex('16',{}),0);
  assert.equal(questionIndex('-1',{}),0);
});
test('every scored practice has short question and action copy', () => {
  assert.ok(questions.every(q=>questionCopy[q.id]?.length===2));
});
