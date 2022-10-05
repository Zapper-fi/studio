import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { BeefyBoostVaultDefinitionsResolver } from '../common/beefy.boost-vault.definition-resolver';
import { BeefyBoostVault, BeefyContractFactory } from '../contracts';

export type BeefyBoostVaultDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddress: string;
};

export abstract class BeefyBoostVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  BeefyBoostVault,
  DefaultDataProps,
  BeefyBoostVaultDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeefyBoostVaultDefinitionsResolver)
    private readonly boostDefinitionsResolver: BeefyBoostVaultDefinitionsResolver,
    @Inject(BeefyContractFactory) protected readonly contractFactory: BeefyContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BeefyBoostVault {
    return this.contractFactory.beefyBoostVault({ address, network: this.network });
  }

  async getDefinitions(): Promise<BeefyBoostVaultDefinition[]> {
    return this.boostDefinitionsResolver.getBoostVaultDefinitions(this.network);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<BeefyBoostVault, BeefyBoostVaultDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return [
      { address: definition.underlyingTokenAddress, metaType: MetaType.SUPPLIED },
      { address: definition.rewardTokenAddress, metaType: MetaType.CLAIMABLE },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<BeefyBoostVault>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<BeefyBoostVault>) {
    const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
      contract.balanceOf(address),
      contract.earned(address),
    ]);
    return [stakedBalanceRaw, rewardBalanceRaw];
  }
}
