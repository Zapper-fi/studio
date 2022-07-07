import { Inject } from '@nestjs/common';
import { utils } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';
import { AngleApiHelper } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.veangle.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAngleVeAngleTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
    @Inject(AngleApiHelper)
    private readonly angleApiHelper: AngleApiHelper,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'angle',
      groupIds: ['santoken'],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    const tokenList = await this.angleApiHelper.fetchTokenList();

    const angleTokenFromTokenList = Object.entries(tokenList).find(v => v[1].symbol === 'ANGLE')!;
    const veAngleTokenFromTokenList = Object.entries(tokenList).find(v => v[1].symbol === 'veANGLE')!;
    const sanUSDCFromTokenList = Object.entries(tokenList).find(v => v[1].symbol === 'sanUSDC_EUR')!;

    const angleToken = allTokens.find(v => v.address.toLowerCase() == angleTokenFromTokenList[0].toLowerCase());
    const sanUSDC_EUR = allTokens.find(v => v.address.toLowerCase() == sanUSDCFromTokenList[0].toLowerCase());

    if (!angleToken) return null;

    const contract = this.angleContractFactory.angleVeangle({
      address: veAngleTokenFromTokenList[0],
      network,
    });

    const apr = (await this.angleApiHelper.getApr())[veAngleTokenFromTokenList[1].symbol];

    const multicall = this.appToolkit.getMulticall(network);
    const totalSupply = await multicall.wrap(contract)['totalSupply()']();

    const token = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: veAngleTokenFromTokenList[0],
      network,
      symbol: veAngleTokenFromTokenList[1].symbol,
      decimals: veAngleTokenFromTokenList[1].decimals,
      supply: Number(utils.formatEther(totalSupply)),
      price: angleToken.price,
      tokens: [angleToken, claimable(sanUSDC_EUR!)],
      displayProps: {
        label: 'veANGLE',
        secondaryLabel: buildDollarDisplayItem(angleToken.price),
        tertiaryLabel: `APR: ${apr.value}`,
        images: getImagesFromToken(angleToken),
      },
    } as AppTokenPosition;
    return token;
  }
}
