import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Y2KFinanceContractFactory, Y2KFinanceStakingRewards } from '../contracts';

const rewardsFactory = '0x9889fca1d9a5d131f5d4306a2bc2f293cafad2f3';
const fromBlock = 33934362;

@PositionTemplate()
export class ArbitrumY2KFinanceFarmV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceStakingRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceContractFactory) protected readonly contractFactory: Y2KFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Y2KFinanceStakingRewards {
    return this.contractFactory.y2KFinanceStakingRewards({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const factory = this.contractFactory.y2KFinanceRewardsFactory({ address: rewardsFactory, network: this.network });
    const filter = factory.filters.CreatedStakingReward();
    const events = await factory.queryFilter(filter, fromBlock);
    const farms = events.map(e => [e.args.hedgeFarm, e.args.riskFarm]).flat();
    return farms.map(farm => ({ address: farm }));
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<Y2KFinanceStakingRewards, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    const [stakingToken, tokenIdRaw, rewardsToken] = await Promise.all([
      contract.stakingToken(),
      contract.id(),
      contract.rewardsToken(),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: stakingToken,
        network: this.network,
        tokenId: tokenIdRaw.toString(),
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: rewardsToken,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    Y2KFinanceStakingRewards,
    DefaultDataProps,
    DefaultContractPositionDefinition
  >): Promise<string> {
    const stakingTokenAddress = contractPosition.tokens[0];
    const vault = this.contractFactory.y2KFinanceVaultV1({
      address: stakingTokenAddress.address,
      network: this.network,
    });
    const name = await vault.name();
    return `${name} Farming`;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceStakingRewards, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const supply = await params.contract.balanceOf(params.address);
    const rewards = await params.contract.earned(params.address);
    return [supply, rewards];
  }
}
