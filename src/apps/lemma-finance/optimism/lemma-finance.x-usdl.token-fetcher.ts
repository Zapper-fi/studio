import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LemmaFinanceContractFactory } from '../contracts';
import { LEMMA_FINANCE_DEFINITION } from '../lemma-finance.definition';

const appId = LEMMA_FINANCE_DEFINITION.id;
const groupId = LEMMA_FINANCE_DEFINITION.groups.xUsdl.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmaFinanceXUsdlTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceContractFactory) private readonly contractFactory: LemmaFinanceContractFactory,
  ) {}

  async getPositions() {
    const underlyingTokenAddresses = [
      '0x4200000000000000000000000000000000000006', // WETH
      '0x68f180fcce6836688e9084f035309e29bf0a2095', // Wbtc
      '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6', // Link
      '0x0994206dfe8de6ec6920ff4d779b0d950605fb53', // CRV
      '0x9e1028f5f1d5ede59748ffcee5532509976840e0', // Perp
      '0x76fb31fb4af56892a25e32cfc43de717950c9278', // AAVE
    ];

    const xusdlAddress = '0x252ea7e68a27390ce0d53851192839a39ab8b38c';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.contractFactory.xUsdl({
      address: xusdlAddress,
      network,
    });

    const [name, symbol, decimals, supplyRaw, assetsPerShare] = await Promise.all([
      multicall.wrap(contract).name(),
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(contract).assetsPerShare(),
    ]);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const tokensRaw = await Promise.all(
      underlyingTokenAddresses.map(async address => {
        const underlyingToken = baseTokens.find(x => x.address.toLowerCase() === address);
        if (!underlyingToken) return null;

        return underlyingToken;
      }),
    );
    const tokens = _.compact(tokensRaw);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = Number(assetsPerShare) / 10 ** decimals;
    const pricePerShare = 1;

    const label = `${name} (${symbol})`;
    const images = [getAppAssetImage(appId, 'xUSDL')];
    const secondaryLabel = buildDollarDisplayItem(price);

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: xusdlAddress,
      network,
      symbol,
      decimals,
      supply,
      tokens,
      price,
      pricePerShare,
      dataProps: {
        liquidity: supply * price,
      },
      displayProps: {
        label,
        images,
        secondaryLabel,
      },
    };

    return [token];
  }
}
