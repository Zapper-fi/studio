import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LemmafinanceContractFactory } from '../contracts';
import { LEMMAFINANCE_DEFINITION } from '../lemmafinance.definition';

const appId = LEMMAFINANCE_DEFINITION.id;
const groupId = LEMMAFINANCE_DEFINITION.groups.xLemmaSynth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmafinanceXLemmaSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmafinanceContractFactory) private readonly lemmafinanceContractFactory: LemmafinanceContractFactory,
  ) {}

  async getPositions() {
    const xLemmaSynths = [
      '0x89c4e9a23Db43641e1B3C5E0691b100E64b50E32', // xLemmaEth
      '0x7D39583e262CBe75a1D698A6D79cd5a2958cb61d', // xLemmaWbtc
      '0x823c55654d6E860F40070ee5625ff8b091df4269', // xLemmaLink
      '0x754E6134872D7a501fFEbA6c186e187DBFdf6f4a', // xLemmaCRV
      '0x3C7E63ba04FF4d5f0673bc93bBD9E73E9DD37Ed2', // xLemmaPerp
      '0x90356c24c1F95CF29543D45122f2554b6A74f201', // xLemmaAAVE
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
    const tokenImages = [
      'xLETH.png',
      'xLBTC.png',
      'xLPERP.png',
      'xLPERP.png',
      'xLPERP.png',
      'xLPERP.png'
    ];

    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      xLemmaSynths.map(async (xlemmaSynth, i) => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.lemmafinanceContractFactory.xLemmaSynth({
          address: xlemmaSynth,
          network,
        });

        const perpLemmaContract = this.lemmafinanceContractFactory.perpLemma({
          address: perpLemmas[i],
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [name, symbol, decimals, supplyRaw, collateral, assetsPerShare] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(perpLemmaContract).usdlCollateral(),
          multicall.wrap(contract).assetsPerShare(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
        const tokens: any = [collateral];
        const price = Number(assetsPerShare) / 10 ** decimals;
        const pricePerShare = Number(assetsPerShare) / 10 ** decimals;

        // // As a label, we'll use the underlying label (i.e.: 'LOOKS' or 'UNI-V2 LOOKS / ETH'), and suffix it with 'Jar'
        const label = `${name} (${symbol})`;
        // // For images, we'll use the underlying token images as well
        // const images = getImagesFromToken(tokens[0]);
        const images = [imageURL + tokenImages[i]];
        // // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(price);
        // // And for a tertiary label, we'll use the APY
        // const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: xlemmaSynth,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {},
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
