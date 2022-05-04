import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

const appId = THALES_DEFINITION.id;
const groupId = THALES_DEFINITION.groups.market.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismThalesMarketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) { }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const tokenContact = this.thalesContractFactory.positionalMarketManager({ address: "0x9227334352A890e51e980BeB7A56Bbdd01499B54", network })
    const [markets] = await Promise.all(
      [multicall.wrap(tokenContact).activeMarkets(0, 1000)]);
    const tokens = await markets.map((address) => {
      const label = `Thales Market`;
      const images = [getAppImg(THALES_DEFINITION.id)];
      const market: AppTokenPosition = {
        type: ContractType.APP_TOKEN,
        address: address,
        appId,
        groupId,
        network,
        symbol: "sUSD",
        decimals: 18,
        supply: 92435001163928768728013871,
        price: 1,
        pricePerShare: 1,
        tokens: [],
        dataProps: {},
        displayProps: { label, images },
      };

      return market;
    });
    return compact(tokens);
  }
}
