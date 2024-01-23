import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { GeistViemContractFactory } from '../contracts';
import { GeistRewards } from '../contracts/viem';

@PositionTemplate()
export class FantomGeistIncentivesPositionFetcher extends ContractPositionTemplatePositionFetcher<GeistRewards> {
  groupLabel = 'Incentives';

  isExcludedFromExplore = true;

  geistTokenAddress = '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GeistViemContractFactory) private readonly contractFactory: GeistViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    const incentivesAddress = '0x297fddc5c33ef988dd03bd13e162ae084ea1fe57';
    return [{ address: incentivesAddress }];
  }

  getContract(address: string) {
    return this.contractFactory.geistRewards({ address, network: this.network });
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: this.geistTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GeistRewards>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getSecondaryLabel(params: GetDisplayPropsParams<GeistRewards>): Promise<DisplayProps['secondaryLabel']> {
    const rewardToken = params.contractPosition.tokens[0];
    return buildDollarDisplayItem(rewardToken.price);
  }

  async getImages(): Promise<string[]> {
    return [getTokenImg(this.geistTokenAddress, this.network)];
  }

  async getTokenBalancesPerPosition({ address, contractPosition }: GetTokenBalancesParams<GeistRewards>) {
    const appTokenAddresses = await this.appToolkit
      .getAppTokenPositions({
        appId: this.appId,
        groupIds: ['supply', 'variable-debt', 'stable-debt'],
        network: this.network,
      })
      .then(tokens => tokens.map(({ address }) => address));

    // The calls fails when it's using the Multicall wrapped version of the contract
    const contract = this.contractFactory.geistRewards({ address: contractPosition.address, network: this.network });
    const rewardBalanceRaw = await contract.read.claimableReward([address, appTokenAddresses]);
    const sum = rewardBalanceRaw.reduce((sum, cur) => sum.add(cur), BigNumber.from(0));

    return [sum];
  }
}
