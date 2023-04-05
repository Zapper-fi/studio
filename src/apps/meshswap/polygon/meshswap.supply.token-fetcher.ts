import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { StatsItem } from '~position/display.interface';
import { RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { MeshswapContractFactory, MeshswapSinglePool } from '../contracts';

export type MeshswapContractPositionDataProps = DefaultAppTokenDataProps & {
  exchangeRate: number;
};

@PositionTemplate()
export class PolygonMeshswapSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<
  MeshswapSinglePool,
  MeshswapContractPositionDataProps
> {
  groupLabel = 'Supply';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MeshswapContractFactory) private readonly contractFactory: MeshswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MeshswapSinglePool {
    return this.contractFactory.meshswapSinglePool({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const singlePoolFactoryContract = this.contractFactory.meshswapSinglePoolFactory({
      network: this.network,
      address: '0x504722a6eabb3d1573bada9abd585ae177d52e7a',
    });

    const poolCountRaw = await multicall.wrap(singlePoolFactoryContract).getPoolCount();
    const poolCount = Number(poolCountRaw);

    const poolAddresses = await Promise.all(
      _.range(0, poolCount).map(async index => {
        return await multicall.wrap(singlePoolFactoryContract).getPoolAddressByIndex(index);
      }),
    );
    return poolAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MeshswapSinglePool>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ contract }: GetDisplayPropsParams<MeshswapSinglePool>): Promise<string> {
    return contract.name();
  }

  async getLiquidity({ appToken, contract }: GetDataPropsParams<MeshswapSinglePool>) {
    const cashRaw = await contract.getCash();
    const borrowAmountRaw = await contract.totalBorrows();
    const cash = Number(cashRaw) / 10 ** appToken.decimals;
    const borrowAmount = Number(borrowAmountRaw) / 10 ** appToken.decimals;

    return borrowAmount + cash;
  }

  async getDataProps(
    params: GetDataPropsParams<MeshswapSinglePool, MeshswapContractPositionDataProps>,
  ): Promise<MeshswapContractPositionDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    const exchangeRateRaw = await params.contract.exchangeRateStored();
    const exchangeRate = Number(exchangeRateRaw) / 10 ** 18;
    return { ...defaultDataProps, exchangeRate };
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<MeshswapSinglePool>): Promise<StatsItem[] | undefined> {
    const { liquidity } = appToken.dataProps;

    return [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const appTokens = await this.appToolkit.getAppTokenPositions<MeshswapContractPositionDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await multicall.wrap(this.getContract(appToken.address)).balanceOf(address);
        const balance = Number(balanceRaw) * appToken.dataProps.exchangeRate;

        return {
          key: this.appToolkit.getPositionKey(appToken),
          balance: balance.toString(),
        };
      }),
    );
  }
}
