/**
 * W11 · TodoForm：只负责「收输入」，不碰列表数据。
 * 数据向上：onAdd(text) 返回 true 才清空输入框，避免校验失败时把用户写的内容丢掉。
 */
import { useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface TodoFormProps {
  onAdd: (text: string) => boolean;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function submit(): void {
    if (onAdd(text)) {
      setText('');
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="todo-bar">
      <input
        type="text"
        className="todo-input"
        placeholder="输入待办事项…"
        aria-label="待办事项内容"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className="todo-add" onClick={submit}>
        添加
      </button>
    </div>
  );
}
