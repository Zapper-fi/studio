import { Inject } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';
import moment, { unix } from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetAddressesParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { YieldProtocolViemContractFactory } from '../contracts';
import { YieldProtocolLendToken } from '../contracts/viem/YieldProtocolLendToken';

export const formatMaturity = (maturity: number) => {
  return moment(unix(maturity)).format('MMMM D, yyyy');
};

type YieldPoolDetails = {
  id: string;
  fyToken: {
    id: string;
  };
};

type YieldSeriesDetails = {
  matured: boolean;
  baseAsset: {
    id: string;
  };
  fyToken: {
    id: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    maturity: number;
  };
};

type YieldRes = {
  pools: YieldPoolDetails[];
  seriesEntities: YieldSeriesDetails[];
};

type FyTokenDefinition = {
  address: string;
  poolAddress?: string;
};

type FyTokenDataProps = DefaultAppTokenDataProps & {
  maturity: number;
};

const query = gql`
  {
    seriesEntities {
      matured
      baseAsset {
        id
      }
      fyToken {
        id
        symbol
        decimals
        totalSupply
        maturity
      }
    }
    pools {
      id
      fyToken {
        id
      }
    }
  }
`;

export abstract class YieldProtocolLendTokenFetcher extends AppTokenTemplatePositionFetcher<
  YieldProtocolLendToken,
  FyTokenDataProps,
  FyTokenDefinition
> {
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolViemContractFactory) protected readonly contractFactory: YieldProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yieldProtocolLendToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<FyTokenDefinition[]> {
    const { pools, seriesEntities } = await gqlFetch<YieldRes>({
      endpoint: this.subgraphUrl,
      query,
    });

    return seriesEntities.map(entity => ({
      address: entity.fyToken.id,
      poolAddress: pools.find(v => v.fyToken.id === entity.fyToken.id)?.id,
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<FyTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<YieldProtocolLendToken>) {
    return [{ address: await contract.read.underlying(), network: this.network }];
  }

  async getPricePerShare({
    appToken,
    definition,
    contract,
    multicall,
  }: GetPricePerShareParams<YieldProtocolLendToken, DefaultAppTokenDataProps, FyTokenDefinition>) {
    if (!definition.poolAddress) return [1];

    const pool = this.contractFactory.yieldProtocolPool({ address: definition.poolAddress, network: this.network });
    const poolBalance = await multicall
      .wrap(pool)
      .read.getBaseBalance()
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return BigNumber.from(0);
        throw err;
      });
    if (poolBalance === BigInt(0)) return [0];

    const maturity = await contract.read.maturity();
    const isMatured = Math.floor(new Date().getTime() / 1000) > Number(maturity);
    if (isMatured) return [1];

    // use smaller unit for weth
    const estimateRaw =
      appToken.tokens[0].symbol === 'WETH'
        ? (await multicall
            .wrap(pool)
            .read.sellFYTokenPreview([BigInt(ethers.utils.parseUnits('.01', appToken.decimals).toString())])) *
          BigInt(100)
        : await multicall
            .wrap(pool)
            .read.sellFYTokenPreview([BigInt(ethers.utils.parseUnits('1', appToken.decimals).toString())]);

    return [+ethers.utils.formatUnits(estimateRaw, appToken.decimals)];
  }

  async getDataProps(params: GetDataPropsParams<YieldProtocolLendToken, FyTokenDataProps, FyTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const maturity = await params.contract.read.maturity();
    return { ...defaultDataProps, maturity: Number(maturity) };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldProtocolLendToken, FyTokenDataProps, FyTokenDefinition>) {
    return `fy${getLabelFromToken(appToken.tokens[0])}`;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<YieldProtocolLendToken, FyTokenDataProps, FyTokenDefinition>) {
    return formatMaturity(appToken.dataProps.maturity);
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<YieldProtocolLendToken, FyTokenDataProps, FyTokenDefinition>) {
    const isMatured = Math.floor(new Date().getTime() / 1000) > Number(appToken.dataProps.maturity);
    return isMatured ? 'Matured' : '';
  }
}
