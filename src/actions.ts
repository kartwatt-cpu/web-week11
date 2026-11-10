import { addTodo, clearCompleted, editTodo, removeTodo, toggleTodo } from './todo';
import type { Todo } from './todo';

/**
 * 把“字符串动作 + any payload”换成可穷举的字面量联合类型。
 * switch 的 5 个分支分别委托给 todo.ts 的纯函数，业务校验仍只有一份。
 */
export type TodoAction =
  | { readonly type: 'add'; readonly text: unknown }
  | { readonly type: 'toggle'; readonly id: number }
  | { readonly type: 'remove'; readonly id: number }
  | { readonly type: 'edit'; readonly id: number; readonly text: unknown }
  | { readonly type: 'clear' };

export function applyTodoAction(todos: Todo[], action: TodoAction): void {
  switch (action.type) {
    case 'add':
      addTodo(todos, action.text);
      return;
    case 'toggle':
      toggleTodo(todos, action.id);
      return;
    case 'remove':
      removeTodo(todos, action.id);
      return;
    case 'edit':
      editTodo(todos, action.id, action.text);
      return;
    case 'clear':
      clearCompleted(todos);
      return;
  }
}
