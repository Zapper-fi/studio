declare module 'file-system-cache' {
  interface CacheManager {
    get(key: string): Promise<string>;
    getSync(key: string): string;
    set(key: string, value: string): Promise<void>;
    setSync(key: string, value: string): void;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    load(): Promise<void>;
  }

  type factoryOpts = { basePath?: string; ns?: string };
  function factory(opts?: factoryOpts): CacheManager;
  export default factory;
}
