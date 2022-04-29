import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QiDaoVaultPositionDataProps } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

import { QiDaoYieldTokenDataProps } from './qi-dao.yield.token-fetcher';

const appId = QI_DAO_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

const ANCHOR_VAULTS = [
  {
    tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    vaultAddress: '0x947d711c25220d8301c087b25ba111fe8cbf6672',
  },
  {
    tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', //USDT
    vaultAddress: '0xa4742a65f24291aa421497221aaf64c70b098d98',
  },
  {
    tokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', //DAI
    vaultAddress: '0x6062e92599a77e62e0cc9749261eb2eac3abd44f',
  },
];

@Register.TvlFetcher({ appId, network })
export class PolygonQiDaoTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly qiDaoContractFactory: QiDaoContractFactory,
  ) {}

  async getTvl() {
    const vaultPositions = await this.appToolkit.getAppContractPositions<QiDaoVaultPositionDataProps>({
      appId,
      groupIds: [QI_DAO_DEFINITION.groups.vault.id],
      network,
    });

    const yieldTokens = await this.appToolkit.getAppTokenPositions<QiDaoYieldTokenDataProps>({
      appId,
      groupIds: [QI_DAO_DEFINITION.groups.yield.id],
      network,
    });

    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const anchorLiquidities = await Promise.all(
      ANCHOR_VAULTS.map(async ({ tokenAddress, vaultAddress }) => {
        const baseToken = baseTokens.find(v => v.address === tokenAddress)!;
        const contract = this.qiDaoContractFactory.erc20({ address: tokenAddress, network });
        const balanceRaw = await multicall.wrap(contract).balanceOf(vaultAddress);
        const balance = Number(balanceRaw) / 10 ** baseToken?.decimals;
        const balanceUSD = balance * baseToken.price;
        return { tokenAddress, vaultAddress, liquidity: balanceUSD };
      }),
    );

    const tvlVaults = sumBy(vaultPositions, v => v.dataProps.liquidity);
    const tvlYieldTokens = sumBy(yieldTokens, v => v.dataProps.liquidity);
    const tvlAnchor = sumBy(anchorLiquidities, v => v.liquidity);

    return tvlVaults + tvlYieldTokens + tvlAnchor;
  }
}
