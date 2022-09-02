import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { PendleContractFactory } from '../contracts';
import { PendleLiquidityMining } from '../contracts/ethers/PendleLiquidityMining';

export type PendleLiquidityMiningDataProps = {
  expiry: number;
};

export type PendleLiquidityMiningDefinition = {
  address: string;
  expiry: number;
};

export abstract class PendleLiquidityMiningContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PendleLiquidityMining,
  PendleLiquidityMiningDataProps,
  PendleLiquidityMiningDefinition
> {
  abstract pendleDataAddress: string;
  abstract liquidityMiningAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleContractFactory) protected readonly contractFactory: PendleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pendleLiquidityMining({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<PendleLiquidityMiningDefinition[]> {
    const definitions = await Promise.all(
      this.liquidityMiningAddresses.map(async address => {
        const contract = this.contractFactory.pendleLiquidityMining({ address, network: this.network });
        const expiriesLength = await multicall.wrap(contract).readAllExpiriesLength();
        return Promise.all(range(Number(expiriesLength)).map(expiry => ({ address, expiry })));
      }),
    );

    return definitions.flat();
  }

  async getUnderlyingTokenAddresses({
    contract,
    definition,
  }: GetUnderlyingTokensParams<PendleLiquidityMining, PendleLiquidityMiningDefinition>) {
    const pendle = this.contractFactory.pendleData({ address: this.pendleDataAddress, network: this.network });
    const [forgeId, bt] = await Promise.all([contract.forge(), contract.baseToken()]);
    return pendle.xytTokens(forgeId, bt, definition.expiry);
  }

  getLabel(
    params: GetDisplayPropsParams<
      PendleLiquidityMining,
      PendleLiquidityMiningDataProps,
      PendleLiquidityMiningDefinition
    >,
  ): Promise<string> {}

  getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<PendleLiquidityMining, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  // async getDataProps({
  //   definition,
  // }: GetDataPropsParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
  //   const { marketAddress, baseTokenAddress, expiry } = definition;
  //   return { marketAddress, baseTokenAddress, expiry };
  // }
}
