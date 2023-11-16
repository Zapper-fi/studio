import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SushiswapKashiViemContractFactory } from '../contracts';
import { SushiswapKashiLendingToken } from '../contracts/viem';

export type SushiswapKashiLeverageDefinition = {
  address: string;
  assetAddress: string;
  collateralAddress: string;
};

export class SushiswapKashiLeverageContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SushiswapKashiLendingToken,
  DefaultDataProps,
  SushiswapKashiLeverageDefinition
> {
  groupLabel = 'Leverage';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SushiswapKashiViemContractFactory) protected readonly contractFactory: SushiswapKashiViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.sushiswapKashiLendingToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<SushiswapKashiLeverageDefinition[]> {
    const sushiswapKashiTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      groupIds: ['lending'],
      network: this.network,
    });

    return sushiswapKashiTokens.map(v => ({
      address: v.address,
      assetAddress: v.tokens[0].address,
      collateralAddress: v.tokens[1].address,
    }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SushiswapKashiLendingToken, SushiswapKashiLeverageDefinition>) {
    return [
      {
        metaType: MetaType.BORROWED,
        address: definition.assetAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.collateralAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SushiswapKashiLendingToken>) {
    const [token0, token1] = contractPosition.tokens;
    const pairLabel = `${getLabelFromToken(token0)} / ${getLabelFromToken(token1)}`;
    return `${getLabelFromToken(token0)} in Kashi ${pairLabel}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<SushiswapKashiLendingToken>) {
    const [debtBalanceRaw, collateralBalanceRaw] = await Promise.all([
      contract.read.userBorrowPart([address]),
      contract.read.userCollateralShare([address]),
    ]);

    return [debtBalanceRaw, collateralBalanceRaw];
  }
}
