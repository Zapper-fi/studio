import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { DefiedgeContractFactory, MiniChefV2 } from '../contracts';

import { DefiedgeStrategyDefinitionsResolver } from './defiedge.strategy.definitions-resolver';

type Definition = {
  address: string;
  strategyAddress: string;
  title: string;
  subTitle: string | null;
  token0Address: string;
  token1Address: string;
  pid: number;
};

export class DefiedgeFarmingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<MiniChefV2> {
  groupLabel = 'Farming';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DefiedgeContractFactory) protected readonly contractFactory: DefiedgeContractFactory,
    protected readonly definitionResolver: DefiedgeStrategyDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MiniChefV2 {
    return this.contractFactory.miniChefV2({ address, network: this.network });
  }

  async getDefinitions() {
    const apiDefinitions = await this.definitionResolver.getFarmingStrategies(this.network);

    const definitions = apiDefinitions.map(
      (v): Definition => ({
        address: v.lmConfig.address.toLowerCase(),
        strategyAddress: v.id,
        title: v.title,
        subTitle: v.subTitle,
        token0Address: v.token0.id.toLowerCase(),
        token1Address: v.token1.id.toLowerCase(),
        pid: v.lmConfig.pid,
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    contract,
    definition,
  }: GetTokenDefinitionsParams<MiniChefV2, Definition>): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.strategyAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.SUSHI(),
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<MiniChefV2, DefaultDataProps, Definition>): Promise<string> {
    return `Staked ${definition.subTitle || definition.title}`;
  }

  async getSecondaryLabel({
    definition,
  }: GetDisplayPropsParams<MiniChefV2, DefaultDataProps, Definition>): Promise<string> {
    return definition.title;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<MiniChefV2, Definition>): Promise<BigNumberish[]> {
    return Promise.all([
      contract.userInfo(contractPosition.dataProps.pid, address).then(e => e.amount),
      contract.pendingSushi(BigNumber.from(contractPosition.dataProps.pid), address),
    ]);
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<MiniChefV2, DefaultDataProps, Definition>): Promise<Definition> {
    return { ...definition };
  }
}
