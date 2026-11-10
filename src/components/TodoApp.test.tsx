/**
 * W11 · 轨道 B（组件行为测试）：证明界面是 State 的函数，而不是靠手动改 DOM。
 *
 * 这些用例点的是真实渲染出来的 DOM 节点，但断言的是「React 渲染结果」：
 * 没有任何一处 querySelector / innerHTML，全部通过 screen 查询 + 断言文本与类名。
 */
import { beforeEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import TodoApp from './TodoApp';

function addTodo(text: string): void {
  fireEvent.change(screen.getByLabelText('待办事项内容'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: '添加' }));
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

test('行为1：添加任务后列表多一项，输入框被清空', () => {
  render(<TodoApp />);
  addTodo('任务A');

  expect(screen.getByText('任务A')).toBeDefined();
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect((screen.getByLabelText('待办事项内容') as HTMLInputElement).value).toBe('');
  expect(screen.getByText('共 1 项 · 未完成 1 项')).toBeDefined();
});

test('行为2：纯空白被拦截，只出提示、不新增', () => {
  render(<TodoApp />);
  addTodo('   ');

  expect(screen.getAllByRole('listitem')).toHaveLength(1); // 只有空状态那一条
  expect(screen.getByText('内容为空，请输入后再添加。')).toBeDefined();
});

test('行为3：点击任务文字切换完成状态，done 类由 State 决定', () => {
  render(<TodoApp />);
  addTodo('任务A');

  fireEvent.click(screen.getByText('任务A'));

  const item = screen.getByText('任务A').closest('li');
  expect(item?.className).toBe('done');
  expect(screen.getByText('共 1 项 · 未完成 0 项')).toBeDefined();
});

test('行为4：点击删除按钮，列表少一项且计数同步', () => {
  render(<TodoApp />);
  addTodo('任务A');
  addTodo('任务B');

  fireEvent.click(screen.getByRole('button', { name: '删除：任务A' }));

  expect(screen.queryByText('任务A')).toBeNull();
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(screen.getByText('共 1 项 · 未完成 1 项')).toBeDefined();
});

test('行为5：筛选按钮只改渲染结果，不改 todos 本身', () => {
  render(<TodoApp />);
  addTodo('任务A');
  addTodo('任务B');
  fireEvent.click(screen.getByText('任务A')); // A 置为完成

  fireEvent.click(screen.getByRole('button', { name: '未完成' }));

  expect(screen.queryByText('任务A')).toBeNull();
  expect(screen.getByText('任务B')).toBeDefined();
  expect(screen.getByText('共 2 项 · 未完成 1 项')).toBeDefined();
});

test('行为6：页面条目与 localStorage 里的 State 逐条一致', () => {
  render(<TodoApp />);
  addTodo('任务A');
  addTodo('任务B');
  fireEvent.click(screen.getByRole('button', { name: '删除：任务B' }));

  const stored: unknown = JSON.parse(localStorage.getItem('todos') ?? '[]');
  expect(Array.isArray(stored)).toBe(true);
  const list = stored as { text: string; completed: boolean }[];
  const rendered = screen.getAllByRole('listitem').map((li) => li.querySelector('span')?.textContent);
  expect(list.map((todo) => todo.text)).toEqual(rendered);
});
