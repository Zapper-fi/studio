import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { GeistContractFactory, GeistRewards } from '../contracts';
import { GEIST_DEFINITION } from '../geist.definition';

const network = Network.FANTOM_OPERA_MAINNET;
const appId = GEIST_DEFINITION.id;
const groupId = GEIST_DEFINITION.groups.incentives.id;

@Register.ContractPositionFetcher({ appId, network, groupId })
export class FantomGeistIncentivesPositionFetcher extends ContractPositionTemplatePositionFetcher<GeistRewards> {
  network = network;
  appId = appId;
  groupId = groupId;
  groupLabel = 'Incentives';

  geistTokenAddress = '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GeistContractFactory) private readonly contractFactory: GeistContractFactory,
  ) {
    super(appToolkit);
  }

  async getDescriptors() {
    const incentivesAddress = '0x297fddc5c33ef988dd03bd13e162ae084ea1fe57';
    return [{ address: incentivesAddress }];
  }

  getContract(address: string) {
    return this.contractFactory.geistRewards({ address, network: this.network });
  }

  async getTokenDescriptors() {
    return [{ address: this.geistTokenAddress, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel(): Promise<string> {
    return 'Claimable GEIST';
  }

  async getSecondaryLabel(params: DisplayPropsStageParams<GeistRewards>): Promise<DisplayProps['secondaryLabel']> {
    const rewardToken = params.contractPosition.tokens[0];
    return buildDollarDisplayItem(rewardToken.price);
  }

  async getImages(): Promise<string[]> {
    return [getTokenImg(this.geistTokenAddress, this.network)];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<GeistRewards>): Promise<BigNumberish[]> {
    const appTokenAddresses = await this.appToolkit
      .getAppTokenPositions({
        appId: GEIST_DEFINITION.id,
        groupIds: [
          GEIST_DEFINITION.groups.supply.id,
          GEIST_DEFINITION.groups.variableDebt.id,
          GEIST_DEFINITION.groups.stableDebt.id,
        ],
        network,
      })
      .then(tokens => tokens.map(({ address }) => address));

    // The calls fails when it's using the Multicall wrapped version of the contract
    const contract = this.contractFactory.geistRewards({ address: contractPosition.address, network: this.network });
    const rewardBalanceRaw = await contract.claimableReward(address, appTokenAddresses, { from: address });
    const sum = rewardBalanceRaw.reduce((sum, cur) => sum.add(cur), BigNumber.from(0));

    return [sum];
  }
}
