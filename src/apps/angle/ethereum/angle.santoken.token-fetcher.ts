import { Inject } from '@nestjs/common';
import { utils } from 'ethers';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';
import { AngleApiHelper } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.santoken.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAngleSantokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
    @Inject(AngleApiHelper)
    private readonly angleApiHelper: AngleApiHelper,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokenList = await this.angleApiHelper.fetchTokenList();
    const APR = await this.angleApiHelper.getApr();

    const sanTokens = Object.entries(tokenList).filter(v => v[1].name.startsWith('sanToken'));

    const tokens = await Promise.all(
      sanTokens.map(async sanToken => {
        const contract = this.angleContractFactory.angleSantoken({
          address: sanToken[0],
          network,
        });

        const [symbol, decimals, supplyRaw, poolManager, stableMaster] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).poolManager(),
          multicall.wrap(contract).stableMaster(),
        ]);

        const stableMasterContract = this.angleContractFactory.angleStablemaster({
          address: stableMaster,
          network,
        });
        const collateralMap = await multicall.wrap(stableMasterContract).collateralMap(poolManager);
        const underlyingToken = baseTokens.find(v => v.address.toLowerCase() === collateralMap.token.toLowerCase());
        const agToken = baseTokens.find(v => v.symbol === 'agEUR');

        if (!underlyingToken || !agToken) return null;

        const price = collateralMap.sanRate
          .mul(utils.parseEther(underlyingToken!.price.toString()))
          .div(utils.parseEther('1'));

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        const apr = APR[symbol];

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: sanToken[0].toLowerCase(),
          network,
          symbol,
          decimals,
          supply,
          tokens: [underlyingToken],
          price: Number(utils.formatEther(price)),
          pricePerShare: Number(utils.formatEther(collateralMap.sanRate)),
          dataProps: {
            sanRate: utils.formatEther(collateralMap.sanRate),
            apr: apr.value,
          },
          displayProps: {
            label: symbol,
            images: [...getImagesFromToken(underlyingToken), ...getImagesFromToken(agToken)],
          },
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
