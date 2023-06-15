import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import Axios from "axios";

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { MeanFinanceContractFactory, MeanFinanceOptimismAirdrop } from '../contracts';

const TOKEN_DISTRIBUTOR = '0xf453cc2cb0d016a028a34162cf1f9efbb799c2d7';
const OP_TOKEN = '0x4200000000000000000000000000000000000042';

export interface OptimismAirdropCampaingResponse {
  positions: {
    id: number;
    from: string;
    to: string;
    version: 'beta' | 'vulnerable';
    volume: number;
  }[];
  totalBoostedVolume: number;
  op: string;
  proof: string[];
}

@PositionTemplate()
export class OptimismMeanFinanceOptimismAirdropAirdropContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel = 'airdrop';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MeanFinanceContractFactory)
    protected readonly meanFinanceContractFactory: MeanFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Contract {
    return this.meanFinanceContractFactory.meanFinanceOptimismAirdrop({
      address: _address,
      network: this.network,
    });
  }

  async getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Optimism Airdrop';
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: TOKEN_DISTRIBUTOR }];
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<Contract, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ metaType: MetaType.CLAIMABLE, address: OP_TOKEN, network: this.network }];
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<MeanFinanceOptimismAirdrop, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const airdropData = await Axios.get<OptimismAirdropCampaingResponse>(
      `https://api.mean.finance/v1/optimism-airdrop/${params.address}`
    )

    const claimed = await params.contract.claimed(params.address);

    return [claimed ? BigNumber.from(0) : BigNumber.from(airdropData.data.op)];
  }
}
