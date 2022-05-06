import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PieDaoContractFactory } from '../contracts';
import { PIE_DAO_DEFINITION } from '../pie-dao.definition';

const appId = PIE_DAO_DEFINITION.id;
const groupId = PIE_DAO_DEFINITION.groups.eDough.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPieDaoEDoughTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PieDaoContractFactory) private readonly contractFactory: PieDaoContractFactory,
  ) {}

  async getPositions() {
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = prices.find(p => p.symbol === 'DOUGH');
    if (!underlyingToken) return [];

    const multicall = this.appToolkit.getMulticall(network);

    const eDoughTokenAddress = '0x63cbd1858bd79de1a06c3c26462db360b834912d';
    const esGmxContract = this.contractFactory.erc20({ address: eDoughTokenAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(esGmxContract).symbol(),
      multicall.wrap(esGmxContract).decimals(),
      multicall.wrap(esGmxContract).totalSupply(),
    ]);

    // Data Props
    const pricePerShare = 1; // Minted 1:1
    const supply = Number(supplyRaw) / 10 ** 18;
    const price = pricePerShare * underlyingToken.price;
    const tokens = [underlyingToken];

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getTokenImg(underlyingToken.address, network)];

    const vaultToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: eDoughTokenAddress,
      appId,
      groupId,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,

      dataProps: {},

      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return [vaultToken];
  }
}
