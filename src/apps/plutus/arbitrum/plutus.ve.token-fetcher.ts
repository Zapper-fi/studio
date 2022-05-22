import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PLUTUS_DEFINITION } from '../plutus.definition';

import { ADDRESSES } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.ve.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getVePosition(address: string, baseAddress: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const baseToken = baseTokens.find(t => t.address === baseAddress)!;
    const veToken = multicall.wrap(this.appToolkit.globalContracts.erc20({ address, network }));
    const [supplyRaw, decimals, symbol] = await Promise.all([
      veToken.totalSupply(),
      veToken.decimals(),
      veToken.symbol(),
    ]);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = 1; // Note: Consult liquidity pools for peg once set up
    const price = baseToken.price * pricePerShare;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens: [baseToken],
      dataProps: {},
      displayProps: {
        label: symbol,
        images: getImagesFromToken(baseToken),
      },
    };
    return token;
  }

  async getPositions() {
    const [plsJones, plsDopex] = await Promise.all([
      this.getVePosition(ADDRESSES.plsJones, ADDRESSES.jones),
      this.getVePosition(ADDRESSES.plsDpx, ADDRESSES.dpx),
    ]);
    return [plsJones, plsDopex];
  }
}
