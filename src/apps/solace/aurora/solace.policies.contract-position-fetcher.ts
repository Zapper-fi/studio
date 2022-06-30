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
const network = Network.AURORA_MAINNET;

const DAI_ADDRESS = '0xe3520349f477a5f6eb06107066048508498a291b';
const SOLACE_COVER_PRODUCT_ADDRESS = '0x501acec83d440c00644ca5c48d059e1840852a64';
const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const PREMIUM_POOL_ADDRESS = '0x0436c20030d0c2e278e7e8e4b42d304a6420d3bb';
const PREMIUM_POOL_TOKENS = [
  '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40', // solace
  '0xe3520349f477a5f6eb06107066048508498a291b', // dai
  '0xb12bfca5a55806aaf64e99521918a4bf0fc40802', // usdc
  '0x4988a896b1227218e4a686fde5eabdcabd91571f', // usdt
  '0xda2585430fef327ad8ee44af8f1f989a2a91a3d2', // frax
  '0xdfa46478f9e5ea86d57387849598dbfb2e964b02', // mimatic
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
        images: [getTokenImg(SOLACE_ADDRESS, Network.AURORA_MAINNET)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [position];
  }
}
