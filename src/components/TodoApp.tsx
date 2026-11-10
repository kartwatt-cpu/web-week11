/**
 * W11 · V4.0 组件层：Todo 应用（容器组件）。
 *
 * 职责边界：
 *   1. 只在这里持有 todos / filter / hint 三个 State；
 *   2. 唯一的更新入口 update()：先 slice() 出副本，交给 W10 的纯函数 applyTodoAction 改副本，
 *      再把「新数组」交给 setTodos —— 保证 React 拿到的是新引用；
 *   3. 数据向下传（todos → TodoList → TodoItem），事件向上传（onAdd / onToggle / onRemove / onEdit）。
 *
 * 不再出现 createElement / appendChild / innerHTML / querySelector：
 * 界面完全由 State 通过 JSX 描述出来，DOM 交给 React 的协调机制去改。
 */
import { useEffect, useState } from 'react';
import { applyTodoAction } from '../actions';
import type { TodoAction } from '../actions';
import { parseTodos } from '../todo';
import type { Filter, Todo } from '../todo';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const STORAGE_KEY = 'todos';

// 取：解析后逐条过 isTodo，坏数据被丢掉而不是让页面崩（逻辑仍在 todo.ts）。
function loadTodos(): Todo[] {
  try {
    return parseTodos(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }
  if (filter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }
  return todos;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>('all');
  const [hint, setHint] = useState('');

  // 存：todos 一变就写回 localStorage；写失败（隐私模式 / 配额满）只提示，不让页面崩。
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error: unknown) {
      setHint('保存失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  }, [todos]);

  // 唯一的更新入口：不改当前 State，改的是副本，返回新引用。
  function update(action: TodoAction): void {
    setTodos((prev) => {
      const draft = prev.slice();
      applyTodoAction(draft, action);
      return draft;
    });
  }

  // 返回 true 表示「已受理」，TodoForm 据此决定要不要清空输入框。
  function handleAdd(text: string): boolean {
    if (text.trim() === '') {
      setHint('内容为空，请输入后再添加。');
      return false;
    }
    setHint('');
    update({ type: 'add', text });
    return true;
  }

  function handleToggle(id: number): void {
    update({ type: 'toggle', id });
  }

  function handleRemove(id: number): void {
    update({ type: 'remove', id });
  }

  function handleEdit(id: number, text: string): void {
    update({ type: 'edit', id, text });
  }

  const shown = filterTodos(todos, filter);
  const remaining = todos.reduce((count, todo) => count + (todo.completed ? 0 : 1), 0);
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? '/api';

  return (
    <div className="todo-app">
      <div className="section-heading">
        <h2>待办事项 Todo</h2>
        <p>V4.0 · React 组件化 + State 驱动</p>
      </div>

      <TodoForm onAdd={handleAdd} />

      <p className="todo-hint" role="status" aria-live="polite">
        {hint}
      </p>

      <div className="todo-filters" role="group" aria-label="筛选待办事项">
        {(['all', 'active', 'completed'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={filter === value ? 'todo-filter is-active' : 'todo-filter'}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? '全部' : value === 'active' ? '未完成' : '已完成'}
          </button>
        ))}
      </div>

      <TodoList
        todos={shown}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />

      <div className="todo-footer">
        <p className="todo-count">
          共 {todos.length} 项 · 未完成 {remaining} 项
        </p>
        <button type="button" className="todo-clear" onClick={() => update({ type: 'clear' })}>
          清除已完成
        </button>
      </div>

      <p className="todo-meta">
        API 基地址：<code>{apiBase}</code> · dev 由 Vite 代理到 localhost:8080，build 后代理失效
      </p>
    </div>
  );
}
