import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import AURIGAMI_DEFINITION from '../aurigami.definition';
import { AurigamiComptroller, AurigamiContractFactory } from '../contracts';

export class AuroraAurigamiClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AurigamiComptroller> {
  appId = AURIGAMI_DEFINITION.id;
  groupId = AURIGAMI_DEFINITION.groups.claimable.id;
  network = Network.AURORA_MAINNET;
  groupLabel = 'Rewards';

  private lensAddress = '0xffdffbdb966cb84b50e62d70105f2dbf2e0a1e70';
  private fairLaunchAddress = '0xc9a848ac73e378516b16e4eebba5ef6afbc0bbc2';
  private rewardTokenAddress = '0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f'; // PLY
  private comptrollerAddress = '0x817af6cfaf35bdc1a634d6cc94ee9e4c68369aeb';
  private stakingPoolIds = [0]; // Currently aurigami has only 1 staking pool

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AurigamiContractFactory) private readonly contractFactory: AurigamiContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AurigamiComptroller {
    return this.contractFactory.aurigamiComptroller({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.comptrollerAddress }];
  }

  async getTokenDefinitions(
    _opts: GetTokenDefinitionsParams<AurigamiComptroller, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ address: this.rewardTokenAddress, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AurigamiComptroller>) {
    const rewardToken = contractPosition.tokens[0];
    return `Claimable ${getLabelFromToken(rewardToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<AurigamiComptroller>): Promise<BigNumberish[]> {
    const { address: comptrollerAddress } = contractPosition;

    const lensContract = this.contractFactory.aurigamiLens({ address: this.lensAddress, network: this.network });
    const rewardMetadata = await lensContract.callStatic.claimRewards(
      comptrollerAddress,
      this.fairLaunchAddress,
      this.stakingPoolIds,
      { from: address },
    );

    return [rewardMetadata.plyAccrured];
  }
}
