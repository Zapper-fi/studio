import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MuxContractFactory } from '../contracts';
import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.mux.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumMuxMuxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly muxContractFactory: MuxContractFactory,
  ) {}

  async getPositions() {
    const muxTokenAddress = '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b';
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(p => p.symbol === 'MCB')!;

    const muxContract = this.muxContractFactory.erc20({ address: muxTokenAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(muxContract).symbol(),
      multicall.wrap(muxContract).decimals(),
      multicall.wrap(muxContract).totalSupply(),
    ]);

    // Data Props
    const pricePerShare = 1; // Minted 1:1
    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = pricePerShare * underlyingToken.price;
    const tokens = [underlyingToken];
    const liquidity = price * supply;

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getAppAssetImage('mux', 'MUX')];

    const muxToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: muxTokenAddress,
      appId: MUX_DEFINITION.id,
      groupId: MUX_DEFINITION.groups.mux.id,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,

      dataProps: {
        liquidity,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return [muxToken];
  }
}
