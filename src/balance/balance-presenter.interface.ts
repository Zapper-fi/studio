import { Product } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { PositionBalance } from '~position/position-balance.interface';

export interface BalancePresenter {
  present(address: string, balances: PositionBalance[]): Promise<{ products: Product[] }>;
}
