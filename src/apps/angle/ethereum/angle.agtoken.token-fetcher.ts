import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';
import { fetchTokenList } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.agtoken.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAngleAgtokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const agTokenAddresses = ['0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8'];

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const tokenList = await fetchTokenList();

    const tokens = await Promise.all(
      agTokenAddresses.map(async agTokenAddress => {
        const contract = this.angleContractFactory.angleAgtoken({
          address: agTokenAddress,
          network,
        });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        const tokenData = baseTokenDependencies.find(v => v.address.toLowerCase() === agTokenAddress.toLowerCase());
        const tokenListData = tokenList[agTokenAddress];

        if (!tokenData || !tokenListData) return null;

        const images = getImagesFromToken(tokenData);
        // console.log('tokenData', tokenData); // eslint-disable-line

        const token = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: agTokenAddress,
          network,
          symbol,
          decimals,
          supply,
          price: tokenData.price,
          tokens: [tokenData],
          displayProps: {
            label: 'agEUR',
            secondaryLabel: buildDollarDisplayItem(tokenData.price),
            images: [...images, tokenListData.logoURI],
            appName: 'Angle',
            balanceDisplayMode: BalanceDisplayMode.DEFAULT,
          },
        } as AppTokenPosition;

        return token;
      }),
    );

    return tokens;
  }
}
