import { test, expect } from 'vitest';
import { applyTodoAction } from './actions';
import type { Todo } from './todo';

// 审查 AI 改造后补的 action 层回归：确保分发器仍然只调用 todo.ts 的校验，
// 而不是在重构时把校验“绕过去”。
test('applyTodoAction：add 仍走 addTodo 的空白校验', () => {
  const todos: Todo[] = [];
  applyTodoAction(todos, { type: 'add', text: '   ' });
  expect(todos.length).toBe(0);
});

test('applyTodoAction：add 仍清洗 script 标签', () => {
  const todos: Todo[] = [];
  applyTodoAction(todos, { type: 'add', text: '<script>alert(1)</script>' });
  expect(todos[0].text).toBe('alert(1)');
});

test('applyTodoAction：clear 只删已完成', () => {
  const todos: Todo[] = [
    { id: 1, text: '未完成', completed: false },
    { id: 2, text: '已完成', completed: true },
  ];
  applyTodoAction(todos, { type: 'clear' });
  expect(todos.map((todo) => todo.text)).toEqual(['未完成']);
});
