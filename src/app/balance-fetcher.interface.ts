export interface BalanceFetcher {
  getBalances(address: string): Promise<string[]>;
}
