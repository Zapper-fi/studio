import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { GravitaContractFactory, StabilityPool } from '../contracts';

export abstract class GravitaStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  groupLabel = 'Stability Pool';
  abstract stabilityPoolAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GravitaContractFactory) protected readonly gravitaContractFactory: GravitaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StabilityPool {
    return this.gravitaContractFactory.stabilityPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.stabilityPoolAddress }];
  }

  async _getDebtToken(contract: StabilityPool): Promise<UnderlyingTokenDefinition> {
    return {
      metaType: MetaType.SUPPLIED,
      address: await contract.debtToken(),
      network: this.network,
    };
  }

  async _getAllCollateralTokens(contract: StabilityPool): Promise<UnderlyingTokenDefinition[]> {
    const allCollateral = await contract.getAllCollateral();
    return Array.from(allCollateral[0])
      .sort()
      .map(t => {
        return { metaType: MetaType.CLAIMABLE, address: t, network: this.network };
      });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<StabilityPool>) {
    const debtToken = await this._getDebtToken(contract);
    const collateralTokens = await this._getAllCollateralTokens(contract);
    return [debtToken, ...collateralTokens];
  }

  async getLabel(): Promise<string> {
    return 'Gravita Stability Pool';
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<StabilityPool>): Promise<BigNumberish[]> {
    const claimableTokens = contractPosition.tokens.filter(isClaimable).map(t => t.address);
    const claimableAmounts = await contract.getDepositorGains(address, claimableTokens.sort());
    return Promise.all([contract.getCompoundedDebtTokenDeposits(address), ...claimableAmounts[1]]);
  }
}
