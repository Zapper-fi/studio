import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ARGO_FINANCE_DEFINITION } from '../argo-finance.definition';

import { ADDRESSES } from './consts';

const appId = ARGO_FINANCE_DEFINITION.id;
const groupId = ARGO_FINANCE_DEFINITION.groups.pledging.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosArgoFinancePledgingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getVePosition(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const contractTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [ARGO_FINANCE_DEFINITION.groups.xArgo.id],
      network,
    });
    const baseToken = contractTokens.find(t => t.symbol === 'xARGO')!;
    const croToken = baseTokens.find(t => t.symbol === 'WCRO')!;
    const veToken = multicall.wrap(this.appToolkit.globalContracts.erc20({ address, network }));
    const [supplyRaw, decimals] = await Promise.all([veToken.totalSupply(), veToken.decimals()]);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = 1; // Note: Consult liquidity pools for peg once set up
    const price = baseToken.price * pricePerShare;
    const liquidity = supply * price;

    const tokens = [supplied(baseToken), claimable(baseToken), claimable(croToken)];
    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: ADDRESSES.pledging,
      network,
      tokens,
      dataProps: { liquidity },
      displayProps: {
        label: 'xARGO Pledging',
        secondaryLabel: buildDollarDisplayItem(price),
        images: getImagesFromToken(baseToken),
      },
    };
    return position;
  }

  async getPositions() {
    const [argo] = await Promise.all([this.getVePosition(ADDRESSES.xargo)]);
    return [argo];
  }
}
