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

import { PikaProtocolViemContractFactory } from '../contracts';
import { PikaProtocolVault } from '../contracts/viem';

@PositionTemplate()
export class OptimismPikaProtocolVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PikaProtocolVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolViemContractFactory) protected readonly contractFactory: PikaProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pikaProtocolVault({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x2fae8c7edd26213ca1a88fc57b65352dbe353698' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PikaProtocolVault>) {
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

  async getLabel({ contractPosition }: GetDisplayPropsParams<PikaProtocolVault>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PikaProtocolVault>) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const rewardContract = this.contractFactory.pikaProtocolVaultReward({
      address: '0x58488bb666d2da33f8e8938dbdd582d2481d4183',
      network: this.network,
    });
    const [stakedBalanceRaw, rewardBalance] = await Promise.all([
      contract.read.getShareBalance([address]),
      multicall.wrap(rewardContract).read.getClaimableReward([address]),
    ]);
    const stakedBalance = BigNumber.from(stakedBalanceRaw).div(100);
    return [stakedBalance, rewardBalance];
  }
}
