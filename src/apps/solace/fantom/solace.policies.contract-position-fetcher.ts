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
const network = Network.FANTOM_OPERA_MAINNET;

const DAI_ADDRESS = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
const SOLACE_COVER_PRODUCT_ADDRESS = '0x501acec83d440c00644ca5c48d059e1840852a64';
const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const PREMIUM_POOL_ADDRESS = '0xbff26e5d913738d073c515bee32035f2aff8c40c';
const PREMIUM_POOL_TOKENS = [
  '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40', // solace
  '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // dai
  '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // usdc
  '0x049d68029688eabf473097a2fc38ef61633a3c7a', // usdt
  '0xdc301622e621166bd8e82f2ca0a26c13ad0be355', // frax
  '0xfb98b335551a418cd0737375a2ea0ded62ea213b', // mimatic
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
        images: [getTokenImg(SOLACE_ADDRESS, Network.FANTOM_OPERA_MAINNET)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [position];
  }
}
