import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { OriginDollarContractFactory, Veogv } from '../contracts';

@PositionTemplate()
export class EthereumOriginDollarRewardsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Veogv> {
  groupLabel = 'Reward';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly contractFactory: OriginDollarContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Veogv {
    return this.contractFactory.veogv({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x0c4576ca1c365868e162554af8e385dc3e7c66d9' }];
  }

  async getTokenDefinitions(): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ address: '0x9c354503c38481a7a7a51629142963f98ecc12d0', metaType: MetaType.CLAIMABLE }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Veogv>) {
    const rewardToken = contractPosition.tokens[0];
    return `${getLabelFromToken(rewardToken)} Staking Rewards`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Veogv, DefaultDataProps>): Promise<BigNumberish[]> {
    const rewardBalance = await contract.previewRewards(address);
    return [rewardBalance];
  }
}
