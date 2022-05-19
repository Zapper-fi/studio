import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { SturdyContractFactory } from '../contracts';
import { STURDY_DEFINITION } from '../sturdy.definition';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.lending.id;
const network = Network.FANTOM_OPERA_MAINNET;

type VaultMonitoringResponse = {
  chain: string;
  tokens: string;
  decimals: number;
  address: string;
  supply: number;
  price: number;
  base: number;
  reward: number;
  rewards: {
    CRV: number;
    CVX: number;
  };
  url: number;
  tvl: number;
  active: boolean;
}[];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomSturdyLendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SturdyContractFactory) private readonly sturdyContractFactory: SturdyContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const ethToken = baseTokens.find(t => t.address === ZERO_ADDRESS);
    if (!ethToken) return [];

    const endpoint = 'https://us-central1-stu-dashboard-a0ba2.cloudfunctions.net/getVaultMonitoring';
    const tokenData = await axios.get<VaultMonitoringResponse>(endpoint).then(v => v.data);

    const tokens = tokenData.map(async data => {
      const symbol = data.tokens;
      const underlyingTokens: BaseToken[] = [];

      const contract = this.sturdyContractFactory.sturdyToken({ address: data.address, network });
      const underlyingTokenAddress = await multicall
        .wrap(contract)
        .UNDERLYING_ASSET_ADDRESS()
        .then(v => v.toLowerCase());
      const underlyingToken = baseTokens.find(t => t.address === underlyingTokenAddress);
      if (underlyingToken) underlyingTokens.push(underlyingToken);

      const token: AppTokenPosition = {
        type: ContractType.APP_TOKEN,
        appId,
        groupId,
        address: data.address,
        network,
        symbol,
        decimals: data.decimals,
        supply: data.supply,
        pricePerShare: 1,
        price: underlyingTokens[0].price,
        tokens: underlyingTokens,
        dataProps: {
          apy: data.base,
          tvl: data.tvl,
        },
        displayProps: {
          label: symbol,
          images: getImagesFromToken(underlyingTokens[0]),
        },
      };
      return token;
    });
    return Promise.all(tokens);
  }
}
