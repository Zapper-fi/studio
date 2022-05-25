import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundCToken } from '~apps/compound';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { PositionService } from '~position/position.service';
import { Network } from '~types';

import { MarketXyzContractFactory } from '../contracts';

type MarketXyzLendingBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  supplyGroupId: string;
  borrowGroupId: string;
  fuseLensAddress: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
  getBorrowBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class MarketXyzLendingBalanceHelper {
  constructor(
    @Inject(MarketXyzContractFactory)
    private readonly marketXyzContractFactory: MarketXyzContractFactory,
    @Inject(PositionService)
    private readonly positionService: PositionService,
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
  ) { }

  async getBalances<T = CompoundCToken>({
    address,
    network,
    appId,
    supplyGroupId,
    borrowGroupId,
    fuseLensAddress,
    getTokenContract,
    getBalanceRaw,
    getBorrowBalanceRaw,
  }: MarketXyzLendingBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const supplyTokens = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [supplyGroupId],
      network,
    });

    const borrowPositions = await this.positionService.getAppContractPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [borrowGroupId],
      network,
    });

    const fuseLens = this.marketXyzContractFactory.poolLens({ address: fuseLensAddress, network });
    const poolsBySupplier = await fuseLens.callStatic.getPoolsBySupplierWithData(address);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    const results = await Promise.all(
      participatedComptrollers.map(async comptrollerAddress => {
        const compSupplyTokens = supplyTokens.filter(v => v.dataProps.comptrollerAddress === comptrollerAddress);
        const compBorrowPositions = borrowPositions.filter(v => v.dataProps.comptrollerAddress === comptrollerAddress);

        const [supplyTokenBalances, borrowPositionBalances] = await Promise.all([
          Promise.all(
            compSupplyTokens.map(async supplyToken => {
              const supplyTokenContract = getTokenContract({ address: supplyToken.address, network });
              const balanceRaw = await getBalanceRaw({ contract: supplyTokenContract, multicall, address });
              return drillBalance(supplyToken, balanceRaw.toString());
            }),
          ),
          Promise.all(
            compBorrowPositions.map(async borrowPosition => {
              const borrowContract = getTokenContract({ address: borrowPosition.address, network });
              const balanceRaw = await getBorrowBalanceRaw({ contract: borrowContract, multicall, address });
              const tokens = [drillBalance(borrowPosition.tokens[0], balanceRaw.toString(), { isDebt: true })];
              return { ...borrowPosition, tokens, balanceUSD: tokens[0].balanceUSD };
            }),
          ),
        ]);

        return [...supplyTokenBalances, ...borrowPositionBalances];
      }),
    );

    return results.flat();
  }
}
