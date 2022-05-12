import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory } from '../contracts';

const appId = CONCENTRATOR_DEFINITION.id;
const groupId = CONCENTRATOR_DEFINITION.groups.acrv.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumConcentratorAcrvTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) { }

  async getPositions() {
    // TODO: replace with recipe once docs are up
    const multicall = this.appToolkit.getMulticall(network);
    const address = '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884'; // EIP-1967 proxy
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(token => token.symbol == 'cvxCRV');
    if (!underlyingToken) return [];

    const contract = this.concentratorContractFactory.aladdinCrv({ address, network });
    const [symbol, decimals, supplyRaw, underlyingRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(contract).totalUnderlying(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = Number(underlyingRaw) / Number(supplyRaw);
    const price = underlyingToken.price * pricePerShare;

    // TODO: add additional properties from https://concentrator-api.aladdin.club/apy/
    const label = `Concentrator aCRV`;
    const images = [getAppImg(appId)];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      tokens: [underlyingToken],
      price,
      pricePerShare,
      dataProps: {},
      displayProps: {
        label,
        images,
      }
    };

    return [token];
  }
}
