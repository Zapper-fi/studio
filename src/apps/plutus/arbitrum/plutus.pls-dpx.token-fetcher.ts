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
const groupId = PLUTUS_DEFINITION.groups.plsDpx.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPlsDpxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly plutusContractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dpxToken = baseTokens.find(v => v.address === '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55');
    if (!dpxToken) return [];

    const plsDpxAddress = '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1';
    const contract = this.plutusContractFactory.erc20({ address: plsDpxAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = dpxToken.price; // @TODO Use pool price when peg pools are live
    const pricePerShare = 1;
    const liquidity = price * supply;
    const tokens = [dpxToken];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: plsDpxAddress,
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
        images: getImagesFromToken(dpxToken),
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
