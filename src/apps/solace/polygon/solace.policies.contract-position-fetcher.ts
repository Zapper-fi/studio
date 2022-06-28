import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.policies.id;
const network = Network.POLYGON_MAINNET;

const DAI_ADDRESS = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
const SOLACE_COVER_PRODUCT_ADDRESS = '0x501acec83d440c00644ca5c48d059e1840852a64';
const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const PREMIUM_POOL_ADDRESS = '0x37cd57c6c7243455ac66631ce37bb7f977c71442';
const PREMIUM_POOL_TOKENS = [
  '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40', // solace
  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // dai
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // usdc
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // usdt
  '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89', // frax
  '0xa3fa99a148fa48d14ed51d610c367c61876997f1', // mimatic
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dai = baseTokens.find(t => t.address === DAI_ADDRESS)!;
    const tokens = [supplied(dai)];

    let liquidity = 0;
    for(var i = 0; i < PREMIUM_POOL_TOKENS.length; ++i) {
      const tokenAddr = PREMIUM_POOL_TOKENS[i];
      const tokenContract = this.solaceContractFactory.erc20({ address: tokenAddr, network });
      const [balanceOfRaw, decimals] = await Promise.all([
        multicall.wrap(tokenContract).balanceOf(PREMIUM_POOL_ADDRESS),
        multicall.wrap(tokenContract).decimals(),
      ]);
      const balanceOf = Number(balanceOfRaw) / 10 ** decimals;
      const tokenZapper = baseTokens.find(t => t.address === tokenAddr)!;
      if(!!tokenZapper) liquidity += balanceOf * tokenZapper.price;
    }

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: SOLACE_COVER_PRODUCT_ADDRESS,
      network,
      tokens,
      dataProps: {
        liquidity,
      },
      displayProps: {
        label: `Solace Portfolio Insurance`, // @TODO Might be nice to include cover amount!
        images: [getTokenImg(SOLACE_ADDRESS, Network.POLYGON_MAINNET)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [position];
  }
}
