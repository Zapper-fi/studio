import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.plsJones.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPlsJonesTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly plutusContractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId: 'sushiswap', groupIds: ['pool'], network });
    const jonesEthToken = appTokens.find(v => v.address === '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c');
    if (!jonesEthToken) return [];

    const plsJonesAddress = '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44';
    const contract = this.plutusContractFactory.erc20({ address: plsJonesAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = jonesEthToken.price; // @TODO Use pool price when peg pools are live
    const pricePerShare = 1;
    const liquidity = price * supply;
    const tokens = [jonesEthToken];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: plsJonesAddress,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,
      dataProps: {},
      displayProps: {
        label: symbol,
        images: getImagesFromToken(jonesEthToken),
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
        ],
      },
    };

    return [token];
  }
}
