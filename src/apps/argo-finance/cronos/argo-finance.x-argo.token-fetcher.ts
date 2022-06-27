import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ARGO_FINANCE_DEFINITION } from '../argo-finance.definition';
import { ArgoFinanceContractFactory } from '../contracts';

import { ADDRESSES } from './consts';

const appId = ARGO_FINANCE_DEFINITION.id;
const groupId = ARGO_FINANCE_DEFINITION.groups.xArgo.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosArgoFinanceXArgoTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ArgoFinanceContractFactory) private readonly argoFinanceContractFactory: ArgoFinanceContractFactory,
  ) {}

  async getVePosition(address: string, baseAddress: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    let baseToken = baseTokens.find(t => t.address === baseAddress)!;
    baseToken.address = address
    baseToken.symbol = 'xARGO'

    const veToken = multicall.wrap(this.appToolkit.globalContracts.erc20({ address, network }));
    const [supplyRaw, decimals, symbol] = await Promise.all([
      veToken.totalSupply(),
      veToken.decimals(),
      veToken.symbol(),
    ]);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = 1; // Note: Consult liquidity pools for peg once set up
    const price = baseToken.price * pricePerShare;
    const liquidity = supply * price;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens: [baseToken],
      dataProps: { liquidity },
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        images: [getTokenImg(address, network)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };
    return token;
  }

  async getPositions() {
    const [argo] = await Promise.all([this.getVePosition(ADDRESSES.xargo, ADDRESSES.argo)]);
    return [argo];
  }
}
