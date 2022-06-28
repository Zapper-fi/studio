import { Inject } from '@nestjs/common';
import { utils } from 'ethers';

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
const groupId = ANGLE_DEFINITION.groups.angle.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAngleAngleTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'angle',
      groupIds: ['santoken'],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    const tokenList = await fetchTokenList();

    const angleTokenFromTokenList = Object.entries(tokenList).find(v => v[1].symbol === 'ANGLE')!;

    const angleToken = allTokens.find(v => v.address.toLowerCase() == angleTokenFromTokenList[0].toLowerCase());

    if (!angleToken) return null;

    const contract = this.angleContractFactory.angleAngleToken({
      address: angleToken.address,
      network,
    });

    const multicall = this.appToolkit.getMulticall(network);
    const totalSupply = await multicall.wrap(contract).totalSupply();

    const images = getImagesFromToken(angleToken);

    const token = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: angleToken.address,
      network,
      symbol: angleToken.symbol,
      decimals: angleToken.decimals,
      supply: Number(utils.formatEther(totalSupply)),
      price: angleToken.price,
      tokens: [angleToken],
      displayProps: {
        label: 'ANGLE',
        secondaryLabel: buildDollarDisplayItem(angleToken.price),
        images: [...images, angleTokenFromTokenList[1].logoURI],
        appName: 'Angle',
        balanceDisplayMode: BalanceDisplayMode.DEFAULT,
      },
    } as AppTokenPosition;
    return token;
  }
}
