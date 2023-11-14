import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { PikaProtocolV3ViemContractFactory } from '../contracts';
import { PikaProtocolV3Vault } from '../contracts/viem';

@PositionTemplate()
export class OptimismPikaProtocolV3VaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PikaProtocolV3Vault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolV3ViemContractFactory) protected readonly contractFactory: PikaProtocolV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pikaProtocolV3Vault({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xd5a8f233cbddb40368d55c3320644fb36e597002' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PikaProtocolV3Vault>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PikaProtocolV3Vault>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PikaProtocolV3Vault>) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const rewardContract = this.contractFactory.pikaProtocolV3Rewards({
      address: '0x939c11c596b851447e5220584d37f12854ba02ae',
      network: this.network,
    });
    const [userShare, vault, totalShare, rewardBalance] = await Promise.all([
      contract.read.getShare([address]),
      contract.read.getVault(),
      contract.read.getTotalShare(),
      multicall.wrap(rewardContract).read.getClaimableReward([address]),
    ]);

    const stakedBalanceRaw = BigNumber.from(userShare).mul(vault.balance).div(totalShare);
    const stakedBalance = stakedBalanceRaw.div(100);

    return [stakedBalance, rewardBalance];
  }
}
