import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { BalancerV2ViemContractFactory } from '../contracts';
import { BalancerFeeDistributor } from '../contracts/viem';

@PositionTemplate()
export class EthereumBalancerV2VeBalRewardsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<BalancerFeeDistributor> {
  groupLabel = 'veBAL incentives';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ViemContractFactory) protected readonly contractFactory: BalancerV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.balancerFeeDistributor({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xd3cf852898b21fc233251427c2dc93d3d604f3bb' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb2', // bb-a-USD v1
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xa13a9247ea42d743238089903570127dda72fe44', // bb-a-USD v2
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xfebb0bbf162e64fb9d0dfe186e517d84c395f016', // bb-a-USD v3
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return 'veBal Claimables';
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<BalancerFeeDistributor>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const claimableTokenAddresses = claimableTokens.map(x => x.address);
    const claimableBalances = await contract.simulate
      .claimTokens([address, claimableTokenAddresses])
      .then(v => v.result);

    return [...claimableBalances];
  }
}
