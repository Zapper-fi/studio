import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { RookContractFactory, RookLiquidityPoolDistributor } from '../contracts';
import { ROOK_DEFINITION } from '../rook.definition';

type RewardOfLiquidityProviderResponse = {
  owner: string;
  earnings_to_date: string;
  nonce: string;
  signature: string;
};

const REWARD_DEFINITIONS = [
  {
    address: '0xaef38e99b9db5e96cab3ce5cbc29a3a1dfeffe71',
    url: `https://indibo-lp-pre.herokuapp.com/reward_of_liquidity_provider`,
    name: 'LP-PRE',
  },
  {
    address: '0xcadf6735144d1d7f1a875a5561555cba5df2f75c',
    url: `https://indibo-lp.herokuapp.com/reward_of_liquidity_provider`,
    name: 'LP',
  },
  {
    address: '0x2777b798fdfb906d42b89cf8f9de541db05dd6a1',
    url: `https://indibo-lpq2.herokuapp.com/reward_of_liquidity_provider`,
    name: 'LP-Q2',
  },
  {
    address: '0xf55a73a366f1f9f03cef4cc10d3cd21e5c6a9026',
    url: `https://indibo-keeper.herokuapp.com/reward_of_keeper`,
    name: 'LP-KEEPER',
  },
  {
    address: '0xd81e97075dbda444ef65db3a96706c679b5311fd',
    url: `https://indibo-hiding.herokuapp.com/reward_of_hiding_game`,
    name: 'LP-HIDING-GAME',
  },
];

export type RookClaimableContractPositionDefinition = {
  address: string;
  url: string;
  name: string;
};

@Injectable()
export class EthereumRookClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  RookLiquidityPoolDistributor,
  DefaultDataProps,
  RookClaimableContractPositionDefinition
> {
  appId = ROOK_DEFINITION.id;
  groupId = ROOK_DEFINITION.groups.claimable.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Claimable';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RookContractFactory) protected readonly contractFactory: RookContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RookLiquidityPoolDistributor {
    return this.contractFactory.rookLiquidityPoolDistributor({ address, network: this.network });
  }

  async getDefinitions(): Promise<RookClaimableContractPositionDefinition[]> {
    return REWARD_DEFINITIONS;
  }

  async getTokenDefinitions(): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ metaType: MetaType.CLAIMABLE, address: '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RookLiquidityPoolDistributor>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<RookLiquidityPoolDistributor, DefaultDataProps>): Promise<BigNumberish[]> {
    try {
      const definition = REWARD_DEFINITIONS.find(t => t.address === contractPosition.address);
      if (!definition) return [];

      const { data } = await Axios.get<RewardOfLiquidityProviderResponse>(`${definition.url}/${address}`);
      const earnedRaw = data.earnings_to_date;
      const earned = new BigNumber(earnedRaw, 16);
      if (earned.eq(0)) return [];

      const claimedRaw = await contract.claimedAmount(address);
      const claimed = new BigNumber(claimedRaw.toString());
      const claimableBalanceRaw = earned.minus(claimed).toFixed(0);
      return [claimableBalanceRaw];
    } catch (err) {
      return [];
    }
  }
}
