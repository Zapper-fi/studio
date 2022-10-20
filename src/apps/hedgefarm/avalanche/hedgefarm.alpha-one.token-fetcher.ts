import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HedgefarmContractFactory } from '../contracts';
import { HEDGEFARM_DEFINITION } from '../hedgefarm.definition';
import {ContractType} from "~position/contract.interface";
import {BaseToken} from "~position/token.interface";
import {RewardAnalytics} from "~apps/spool/ethereum/spool.types";
import {ANALYTICS_API_BASE_URL} from "~apps/spool/ethereum/spool.constants";
import Axios from "axios";
import {Performance} from "~apps/hedgefarm/avalanche/hedgefarm.types";
import {buildDollarDisplayItem} from "~app-toolkit/helpers/presentation/display-item.present";

const appId = HEDGEFARM_DEFINITION.id;
const groupId = HEDGEFARM_DEFINITION.groups.alphaOne.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheHedgefarmAlphaOneTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HedgefarmContractFactory) private readonly hedgefarmContractFactory: HedgefarmContractFactory,
  ) {}

  async getPerformance(): Promise<Performance> {
    const url = 'https://api.hedgefarm.workers.dev/alpha1/performance';
    return await Axios.get<Performance>(url).then(v => v.data);
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const alphaOne = '0xde4133f0cfa1a61ba94ec64b6fede4acc1fe929e';
    const usdc = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';

    const contract = this.hedgefarmContractFactory.alphaOne({
      address: alphaOne,
      network,
    });

    const [symbol, decimals, supplyRaw, sharePrice, totalBalance] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(contract).pricePerShare(),
      multicall.wrap(contract).totalBalance()
    ]);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(
        network
    );
    const allTokens = [...baseTokens];

    const underlyingTokenAddress = usdc.toLowerCase();
    const underlyingToken = allTokens.find((v) => v.address === underlyingTokenAddress);
    if (!underlyingToken) return null;
    const underlying: BaseToken[] = [underlyingToken];

    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = Number(sharePrice) / 10 ** 6;
    const price = Number(pricePerShare) * underlyingToken.price;
    const balance = Number(totalBalance) / 10 ** 6;

    const performance = await this.getPerformance();
    const label = "HedgeFarm Alpha #1 USDC";
    const secondaryLabel = `TVL: ${balance.toFixed(0)}$`;
    const tertiaryLabel = `${(performance.averageApy * 100).toFixed(2)}% APY`;
    const image = "https://hedgefarm.finance/hedgefarm-icon.png";

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: alphaOne,
      network,
      symbol,
      decimals,
      underlying,
      supply,
      price,
      pricePerShare,
      dataProps: {
        apy: performance.averageApy,
        liquidity: balance
      },
      displayProps: {
        "label": label,
        "images": [image],
        secondaryLabel: secondaryLabel,
        tertiaryLabel: tertiaryLabel
      }
    };

    return token;
  }
}
