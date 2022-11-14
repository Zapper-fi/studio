import { AsyncLocalStorage } from 'async_hooks';

export const BALANCE_LOCALSTORAGE_FLAGS = new AsyncLocalStorage<{ includeZeroBalances: boolean }>();
