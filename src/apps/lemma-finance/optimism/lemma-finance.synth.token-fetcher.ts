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

const synthAddresses = [
  {
    synthAddress: '0x3bc414fa971189783acee4dee281067c322e3412',
    perpAddress: '0x29b159ae784accfa7fb9c7ba1de272bad75f5674',
  },
  {
    synthAddress: '0x8a641696caf0f59bb7a53cf8d2dc943ed95229a6',
    perpAddress: '0xe161c6c9f2fc74ac97300e6f00648284d83cbd19',
  },
  {
    synthAddress: '0x5c39a4a368ab3c3239d20eb4219e0361bd2ad092',
    perpAddress: '0xdd4d71d3563c24e38525661896e1d01fd8c2c9a5',
  },
  {
    synthAddress: '0x546ba811099883bef35fa360e7ded8af439831f3',
    perpAddress: '0x119f85ecfcfbc1d7033d266192626202df7dbdf2',
  },
  {
    synthAddress: '0xd1a988b024c55d7baabb07fd531d63a4e19e3b4c',
    perpAddress: '0x13c214b430fe304c4c6437f3564a690cd4e4f23b',
  },
  {
    synthAddress: '0xa7c657a94eb9571f4e94f49943af1130e6d7337c',
    perpAddress: '0xfe1eb36d31ead771fd5e051ee8cc424db6416567',
  },
];

const appId = LEMMA_FINANCE_DEFINITION.id;
const groupId = LEMMA_FINANCE_DEFINITION.groups.synth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmaFinanceLemmaSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceContractFactory) private readonly contractFactory: LemmaFinanceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      synthAddresses.map(async position => {
        const contract = this.contractFactory.synth({
          address: position.synthAddress,
          network,
        });

        const perpContract = this.contractFactory.perpLemma({
          address: position.perpAddress,
          network,
        });

        const [name, symbol, decimals, supplyRaw, collateral, usdc, indexPrice] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).tailCollateral(),
          multicall.wrap(perpContract).usdc(),
          multicall.wrap(perpContract).getIndexPrice(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const usdcToken = baseTokens.find(x => x.address.toLowerCase() === usdc.toLowerCase());
        const collateralToken = baseTokens.find(x => x.address.toLowerCase() === collateral.toLowerCase());
        if (!usdcToken || !collateralToken) return null;

        const tokens = [usdcToken, collateralToken];
        const price = Number(indexPrice) / 10 ** decimals;
        const pricePerShare = 1;

        const label = `${name} (${symbol})`;
        const images = [getAppAssetImage(appId, symbol)];
        const secondaryLabel = buildDollarDisplayItem(price);

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: position.synthAddress,
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
