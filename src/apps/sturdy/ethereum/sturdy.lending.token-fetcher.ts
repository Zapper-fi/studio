import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { SturdyContractFactory } from '../contracts';
import { STURDY_DEFINITION } from '../sturdy.definition';
import { VaultMonitoringResponse, cacheOnIntervalKeyCreationHelper, TIMEOUT_DURATION } from '../helpers/constants';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.lending.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSturdyLendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SturdyContractFactory) private readonly sturdyContractFactory: SturdyContractFactory,
  ) {}

  @CacheOnInterval({
    key: cacheOnIntervalKeyCreationHelper(appId, groupId, network),
    timeout: TIMEOUT_DURATION,
  })
  private async getVaultMonitoringData() {
    const endpoint = 'https://us-central1-stu-dashboard-a0ba2.cloudfunctions.net/getVaultMonitoring?chain=ethereum';
    const data = await axios.get<VaultMonitoringResponse>(endpoint).then(res => res.data);
    return data;
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const ethToken = baseTokens.find(t => t.address === ZERO_ADDRESS);
    if (!ethToken) return [];

    const tokenData = await this.getVaultMonitoringData();

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
          statsItems: [
            {
              label: 'APY',
              value: buildPercentageDisplayItem(data.base),
            },
            {
              label: 'Liquidity',
              value: buildNumberDisplayItem(data.tvl),
            },
          ],
        },
      };
      return token;
    });
    return Promise.all(tokens);
  }
}
