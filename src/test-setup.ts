/**
 * W11 测试环境补丁：Node 25 默认带着实验性的全局 localStorage，
 * 它会盖住 jsdom 的实现 —— 表现为 window.localStorage 存在、但连 clear() 都没有。
 * 这里直接用一个内存版 Storage 顶上去，保证组件里写的 localStorage 与测试读写的是同一份。
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const current = globalThis.localStorage as Partial<Storage> | undefined;
const usable = current !== undefined && typeof current.clear === 'function';

if (!usable) {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
  }
}
