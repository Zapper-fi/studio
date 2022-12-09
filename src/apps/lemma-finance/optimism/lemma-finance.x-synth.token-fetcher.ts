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

const xSynthAddresses = [
  {
    xSynthAddress: '0x89c4e9a23db43641e1b3c5e0691b100e64b50e32',
    perpAddress: '0x29b159ae784accfa7fb9c7ba1de272bad75f5674',
    imageName: 'xLETH',
  },
  {
    xSynthAddress: '0x7d39583e262cbe75a1d698a6d79cd5a2958cb61d',
    perpAddress: '0xe161c6c9f2fc74ac97300e6f00648284d83cbd19',
    imageName: 'xLBTC',
  },
  {
    xSynthAddress: '0x823c55654d6e860f40070ee5625ff8b091df4269',
    perpAddress: '0xdd4d71d3563c24e38525661896e1d01fd8c2c9a5',
    imageName: 'xLPERP',
  },
  {
    xSynthAddress: '0x754e6134872d7a501ffeba6c186e187dbfdf6f4a',
    perpAddress: '0x119f85ecfcfbc1d7033d266192626202df7dbdf2',
    imageName: 'xLPERP',
  },
  {
    xSynthAddress: '0x3c7e63ba04ff4d5f0673bc93bbd9e73e9dd37ed2',
    perpAddress: '0x13c214b430fe304c4c6437f3564a690cd4e4f23b',
    imageName: 'xLPERP',
  },
  {
    xSynthAddress: '0x90356c24c1f95cf29543d45122f2554b6a74f201',
    perpAddress: '0xfe1eb36d31ead771fd5e051ee8cc424db6416567',
    imageName: 'xLPERP',
  },
];

const appId = LEMMA_FINANCE_DEFINITION.id;
const groupId = LEMMA_FINANCE_DEFINITION.groups.xSynth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmaFinanceXSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceContractFactory) private readonly contractFactory: LemmaFinanceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      xSynthAddresses.map(async position => {
        const contract = this.contractFactory.xSynth({
          address: position.xSynthAddress,
          network,
        });

        const perpLemmaContract = this.contractFactory.perpLemma({
          address: position.perpAddress,
          network,
        });

        const [name, symbol, decimals, supplyRaw, collateral, usdc, assetsPerShare] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(perpLemmaContract).usdlCollateral(),
          multicall.wrap(perpLemmaContract).usdc(),
          multicall.wrap(contract).assetsPerShare(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const usdcToken = baseTokens.find(x => x.address.toLowerCase() === usdc.toLowerCase());
        const collateralToken = baseTokens.find(x => x.address.toLowerCase() === collateral.toLowerCase());
        if (!usdcToken || !collateralToken) return null;

        const tokens = [usdcToken, collateralToken];
        const price = Number(assetsPerShare) / 10 ** decimals;
        const pricePerShare = Number(assetsPerShare) / 10 ** decimals;

        const label = `${name} (${symbol})`;
        const images = [getAppAssetImage(appId, position.imageName)];
        const secondaryLabel = buildDollarDisplayItem(price);

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: position.xSynthAddress,
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

        return token;
      }),
    );

    return _.compact(tokens);
  }
}
