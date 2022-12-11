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
    const underlyingTokenAddresses = ['0x96f2539d3684dbde8b3242a51a73b66360a5b541'];

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: LEMMA_FINANCE_DEFINITION.id,
      groupIds: [LEMMA_FINANCE_DEFINITION.groups.usdl.id],
      network,
    });

    const xusdlAddress = '0x252ea7e68a27390ce0d53851192839a39ab8b38c';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.contractFactory.xUsdl({
      address: xusdlAddress,
      network,
    });

    const [name, symbol, decimals, supplyRaw, assetsPerShareRaw] = await Promise.all([
      multicall.wrap(contract).name(),
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(contract).assetsPerShare(),
    ]);

    const tokensRaw = await Promise.all(
      underlyingTokenAddresses.map(underlyingTokenAddress => {
        const underlyingToken = appTokens.find(x => x.address === underlyingTokenAddress);
        if (!underlyingToken) null;

        return underlyingToken;
      }),
    );

    const tokens = _.compact(tokensRaw);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const assetPerShare = Number(assetsPerShareRaw) / 10 ** decimals;
    const price = 1 / assetPerShare;
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
