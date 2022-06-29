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
const network = Network.ETHEREUM_MAINNET;

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
const SOLACE_COVER_PRODUCT_ADDRESS = '0x501acebe29eabc346779bcb5fd62eaf6bfb5320e';
const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const PREMIUM_POOL_ADDRESS = '0x88fddce9ad3c5a12c06b597f0948f8eaffc3862d';
const PREMIUM_POOL_TOKENS = [
  '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40', // solace
  '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdc
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // usdt
  '0x853d955acef822db058eb8505911ed77f175b99e', // frax
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
    for (let i = 0; i < PREMIUM_POOL_TOKENS.length; ++i) {
      const tokenAddr = PREMIUM_POOL_TOKENS[i];
      const tokenContract = this.solaceContractFactory.erc20({ address: tokenAddr, network });
      const [balanceOfRaw, decimals] = await Promise.all([
        multicall.wrap(tokenContract).balanceOf(PREMIUM_POOL_ADDRESS),
        multicall.wrap(tokenContract).decimals(),
      ]);
      const balanceOf = Number(balanceOfRaw) / 10 ** decimals;
      const tokenZapper = baseTokens.find(t => t.address === tokenAddr)!;
      if (tokenZapper) liquidity += balanceOf * tokenZapper.price;
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
        images: [getTokenImg(SOLACE_ADDRESS, Network.ETHEREUM_MAINNET)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [position];
  }
}
