import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SturdyContractFactory } from '../contracts';
import { STURDY_DEFINITION } from '../sturdy.definition';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.lending.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomSturdyLendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SturdyContractFactory) private readonly contractFactory: SturdyContractFactory,
  ) { }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const ethToken = baseTokens.find(t => t.address === ZERO_ADDRESS);
    if (!ethToken) return [];

    const endpoint = 'https://us-central1-stu-dashboard-a0ba2.cloudfunctions.net/getVaultMonitoring';
    const tokenData = await axios.get<any[]>(endpoint).then(v => v.data);

    return tokenData.map(data => {
      const symbol = data.tokens;
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
        price: data.price,
        tokens: [ethToken],
        dataProps: {
          apy: data.base,
          tvl: data.tvl
        },
        displayProps: {
          label: symbol,
          images: []
        }
      };
      return token
    })
  }
}
