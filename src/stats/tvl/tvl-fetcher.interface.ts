export interface TvlFetcher {
  getTvl(): Promise<number>;
}
