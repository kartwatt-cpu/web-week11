/**
 * W11 · TodoItem：一行任务，只读展示 + 把点击「通知」父组件。
 *
 * 坑（第 11 周 PPT 第 13 页）：const currentTodo = todo 不会创建新对象，
 * 直接写 currentTodo.completed = true 会就地改掉父组件 State 里的那一项。
 * 所以这里一行都不改 todo，只调用父组件传下来的回调。
 */
import type { Todo } from '../todo';

export interface TodoItemProps {
  readonly todo: Todo;
  readonly onToggle: (id: number) => void;
  readonly onRemove: (id: number) => void;
  readonly onEdit: (id: number, text: string) => void;
}

export default function TodoItem({ todo, onToggle, onRemove, onEdit }: TodoItemProps) {
  function handleEditClick(): void {
    const nextText = window.prompt('修改任务', todo.text);
    if (nextText !== null) {
      onEdit(todo.id, nextText);
    }
  }

  return (
    <li className={todo.completed ? 'done' : undefined} onClick={() => onToggle(todo.id)}>
      <span>{todo.text}</span>
      <button
        type="button"
        className="todo-edit"
        aria-label={'编辑：' + todo.text}
        onClick={(event) => {
          event.stopPropagation();
          handleEditClick();
        }}
      >
        编辑
      </button>
      <button
        type="button"
        className="todo-del"
        aria-label={'删除：' + todo.text}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(todo.id);
        }}
      >
        删除
      </button>
    </li>
  );
}
