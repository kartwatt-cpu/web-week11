/**
 * W11 · TodoList：只负责「按数组渲染列表」，不持有任何数据。
 * todos 从父组件传下来，只读；点击事件通过 onToggle / onRemove / onEdit 往上传。
 */
import type { Todo } from '../todo';
import TodoItem from './TodoItem';

export interface TodoListProps {
  readonly todos: readonly Todo[];
  readonly onToggle: (id: number) => void;
  readonly onRemove: (id: number) => void;
  readonly onEdit: (id: number, text: string) => void;
}

export default function TodoList({ todos, onToggle, onRemove, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <ul className="todo-list" aria-label="待办列表" aria-live="polite">
        <li className="todo-empty">还没有任务，先添加一条吧。</li>
      </ul>
    );
  }

  return (
    <ul className="todo-list" aria-label="待办列表" aria-live="polite">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
