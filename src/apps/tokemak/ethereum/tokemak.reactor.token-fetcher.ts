import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TokemakContractFactory } from '../contracts';
import { TOKEMAK_DEFINITION } from '../tokemak.definition';

const REACTORS = [
  '0xd3d13a578a53685b4ac36a1bab31912d2b2a2f36', // tWETH
  '0x04bda0cf6ad025948af830e75228ed420b0e860d', // tUSDC
  '0xa760e26aa76747020171fcf8bda108dfde8eb930', // tTOKE (Legacy)
  '0x1b429e75369ea5cd84421c1cc182cee5f3192fd3', // tUNI-TOKE/ETH
  '0x8858a739ea1dd3d80fe577ef4e0d03e88561faa3', // tSLP-TOKE/ETH
  '0xe7a7d17e2177f66d035d9d50a7f48d8d8e31532d', // tOHM
  '0xd3b5d9a561c293fb42b446fe7e237daa9bf9aa84', // tALCX
  '0x15a629f0665a3eb97d7ae9a7ce7abf73aeb79415', // tTCR
  '0xadf15ec41689fc5b6dca0db7c53c9bfe7981e655', // tFXS
  '0xf49764c9c5d644ece6ae2d18ffd9f1e902629777', // tSUSHI
  '0x808d3e6b23516967ceae4f17a5f9038383ed5311', // tFOX
  '0xdc0b02849bb8e0f126a216a2840275da829709b0', // tAPW
  '0x41f6a95bacf9bc43704c4a4902ba5473a8b00263', // tgOHM
  '0x0ce34f4c26ba69158bc2eb8bf513221e44fdfb75', // tDAI
  '0xeff721eae19885e17f5b80187d6527aad3ffc8de', // tSNX
  '0x2fc6e9c1b2c07e18632efe51879415a580ad22e1', // tGAMMA
  '0x03dcccd17cc36ee61f9004bcfd7a85f58b2d360d', // tFEI
  '0x2e9f9becf5229379825d0d3c1299759943bd4fed', // tMIM
  '0x482258099de8de2d0bda84215864800ea7e6b03d', // tWORMUST
  '0x9eee9ee0cbd35014e12e1283d9388a40f69797a3', // tLUSD
  '0x94671a3cee8c7a12ea72602978d1bb84e920efb2', // tFRAX
  '0x7211508d283353e77b9a7ed2f22334c219ad4b4c', // tALUSD
  '0x061aee9ab655e73719577ea1df116d7139b2a7e7', // tMYC
];

const appId = TOKEMAK_DEFINITION.id;
const groupId = TOKEMAK_DEFINITION.groups.reactor.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTokemakReactorTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TokemakContractFactory) private readonly tokemakContractFactory: TokemakContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: 'sushiswap', groupIds: ['pool'], network },
      { appId: 'uniswap-v2', groupIds: ['pool'], network },
      { appId: 'olympus', groupIds: ['g-ohm'], network },
    );

    const reactorTokens = await Promise.all(
      REACTORS.map(async reactorAddress => {
        const reactorContract = this.tokemakContractFactory.tokemakReactor({ address: reactorAddress, network });
        const underlyingTokenAddressRaw = await multicall.wrap(reactorContract).underlyer();
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();

        const appTokensMatch = appTokens.find(pool => pool.address === underlyingTokenAddress);
        const baseTokensMatch = baseTokens.find(t => t.address === underlyingTokenAddress);
        const underlyingToken = appTokensMatch ?? baseTokensMatch;
        if (!underlyingToken) return null;

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(reactorContract).symbol(),
          multicall.wrap(reactorContract).decimals(),
          multicall.wrap(reactorContract).totalSupply(),
        ]);

        const pricePerShare = 1; // minted 1:1
        const price = pricePerShare * underlyingToken.price;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const liquidity = supply * price;
        const tokens = [underlyingToken];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = getImagesFromToken(underlyingToken);

        const reactorToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: reactorAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
            ],
          },
        };

        return reactorToken;
      }),
    );

    return compact(reactorTokens);
  }
}
