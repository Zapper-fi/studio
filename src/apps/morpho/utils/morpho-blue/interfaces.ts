import { BigNumber } from 'ethers';

export interface MarketParams {
  loanToken: string;
  collateralToken: string;
  oracle: string;
  irm: string;
  lltv: BigNumber;
}

export interface MarketState {
  totalSupplyAssets: BigNumber;
  totalSupplyShares: BigNumber;
  totalBorrowAssets: BigNumber;
  totalBorrowShares: BigNumber;
  lastUpdate: BigNumber;
  fee: BigNumber;
}

export interface UserPosition {
  supplyShares: BigNumber;
  borrowShares: BigNumber;
  collateral: BigNumber;
}
