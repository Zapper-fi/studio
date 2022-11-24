import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage, getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { supplied } from '~position/position.utils';

import { LemmafinanceContractFactory } from '../contracts';
import { LEMMAFINANCE_DEFINITION } from '../lemmafinance.definition';

const appId = LEMMAFINANCE_DEFINITION.id;
const groupId = LEMMAFINANCE_DEFINITION.groups.LemmaSynth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmafinanceLemmaSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmafinanceContractFactory) private readonly lemmafinanceContractFactory: LemmafinanceContractFactory,
  ) {}

  async getPositions() {
    const LemmaSynths = [
      '0x3BC414FA971189783ACee4dEe281067C322E3412', // LemmaEth
      '0x8A641696Caf0f59bB7a53CF8D2dc943ED95229A6', // LemmaWbtc
      '0x5C39a4a368AB3c3239d20eb4219e0361Bd2ad092', // LemmaLink
      '0x546ba811099883bEf35Fa360e7ded8Af439831f3', // LemmaCRV
      '0xd1a988b024C55d7bAaBB07fD531d63A4E19e3B4C', // LemmaPerp
      '0xA7C657a94Eb9571f4e94F49943Af1130e6D7337c', // LemmaAAVE
    ];

    const perpLemmas = [
      '0x29b159aE784Accfa7Fb9c7ba1De272bad75f5674', // PerpLemmaWeth
      '0xe161C6c9F2fC74AC97300e6f00648284d83cBd19', // PerpLemmaWbtc
      '0xdd4d71D3563C24E38525661896e1d01Fd8c2c9A5', // PerpLemmaLink
      '0x119f85ECFcFBC1d7033d266192626202Df7dbDf2', // PerpLemmaCRV
      '0x13c214b430fE304C4C6437F3564A690cd4e4f23B', // PerpLemmaPerp
      '0xFE1EB36d31ead771Fd5E051ee8CC424dB6416567', // PerpLemmaAAVE
    ];

    const imageURL = 'src/apps/lemmafinance/assets/';
    const tokenImages = ['LETH', 'LBTC', 'LLink', 'LCRV', 'LPERP', 'LAAVE'];

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      LemmaSynths.map(async (lemmaSynth, i) => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.lemmafinanceContractFactory.lemmaSynth({
          address: lemmaSynth,
          network,
        });

        const perpLemmaContract = this.lemmafinanceContractFactory.perpLemma({
          address: perpLemmas[i],
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [name, symbol, decimals, supplyRaw, collateral, usdc, indexPrice] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).tailCollateral(),
          multicall.wrap(perpLemmaContract).usdc(),
          multicall.wrap(perpLemmaContract).getIndexPrice(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
        const usdcToken = baseTokens.find(x => x.address.toLowerCase() === usdc.toLowerCase());
        const collateralToken = baseTokens.find(x => x.address.toLowerCase() === collateral.toLowerCase());
        const tokens: any = [usdcToken, collateralToken];
        const price = Number(indexPrice) / 10 ** decimals;
        const pricePerShare = Number(1);

        // // As a label, we'll use the underlying label (i.e.: 'LOOKS' or 'UNI-V2 LOOKS / ETH'), and suffix it with 'Jar'
        const label = `${name} (${symbol})`;
        // // For images, we'll use the underlying token images as well
        const images = [getAppAssetImage(appId, tokenImages[i])];
        // // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(price);
        // // And for a tertiary label, we'll use the APY
        // const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: lemmaSynth,
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
            tertiaryLabel: '',
          },
        };
        return token;
      }),
    );

    return tokens;
  }
}
