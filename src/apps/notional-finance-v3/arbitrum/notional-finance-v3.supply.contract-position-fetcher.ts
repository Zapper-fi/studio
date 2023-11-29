import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { pick, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { NotionalFinanceV3ViemContractFactory } from '../contracts';
import { NotionalView } from '../contracts/viem';

export type NotionalFinanceLendingDefinition = {
  address: string;
  underlyingTokenAddress: string;
  currencyId: number;
  tokenId: string;
  fCashPV: number;
  maturity: number;
  type: string;
};

export type NotionalFinanceLendingDataProps = {
  currencyId: number;
  tokenId: string;
  maturity: number;
  fCashPV: number;
  positionKey: string;
  type: string;
};

const NOTIONAL_CONSTANT = 10 ** 7;
const SECONDS_IN_YEAR = 31104000; // 360 days

@PositionTemplate()
export class ArbitrumNotionalFinanceV3SupplyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  NotionalView,
  NotionalFinanceLendingDataProps,
  NotionalFinanceLendingDefinition
> {
  groupLabel = 'Supply';

  notionalViewContractAddress = '0x1344a36a1b56144c3bc62e7757377d288fde0369';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NotionalFinanceV3ViemContractFactory)
    protected readonly contractFactory: NotionalFinanceV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.notionalView({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<NotionalFinanceLendingDefinition[]> {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });

    const currencyCount = await multicall.wrap(notionalViewContract).read.getMaxCurrencyId();
    const currencyRange = range(1, currencyCount + 1);
    const definitions = await Promise.all(
      currencyRange.map(async currencyId => {
        const currency = await multicall.wrap(notionalViewContract).read.getCurrency([currencyId]);
        const underlyingTokenAddress = currency[1].tokenAddress.toLowerCase();
        const activeMarkets = await multicall.wrap(notionalViewContract).read.getActiveMarkets([currencyId]);

        const markets = await Promise.all(
          activeMarkets.map(async activeMarket => {
            const type = 'lending';
            const maturity = Number(activeMarket.maturity);
            const tokenId = await multicall
              .wrap(notionalViewContract)
              .read.encodeToId([currencyId, maturity, 0])
              .then(v => v.toString());

            const apy = Number(activeMarket.lastImpliedRate ?? 0) / NOTIONAL_CONSTANT;

            const dateNowEpoch = Date.now() / 1000;
            const timeToMaturity = (maturity - dateNowEpoch) / SECONDS_IN_YEAR;
            const lastImpliedRate = apy / 100;
            const fCashPV = 1 / Math.exp(lastImpliedRate * timeToMaturity);

            return {
              address: this.notionalViewContractAddress,
              currencyId,
              underlyingTokenAddress,
              maturity,
              fCashPV,
              tokenId,
              type,
            };
          }),
        );

        return markets;
      }),
    );

    return definitions.flat();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<NotionalView, NotionalFinanceLendingDefinition>) {
    return [{ metaType: MetaType.SUPPLIED, address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getDataProps(
    params: GetDataPropsParams<NotionalView, NotionalFinanceLendingDataProps, NotionalFinanceLendingDefinition>,
  ) {
    const defaultDataProps = await super.getDataProps(params);
    const props = pick(params.definition, ['currencyId', 'tokenId', 'maturity', 'type']);
    const fCashPV = params.definition.fCashPV;
    return { ...defaultDataProps, ...props, fCashPV, positionKey: Object.values(props).join(':') };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<NotionalView>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<NotionalView, NotionalFinanceLendingDataProps>): Promise<BigNumberish[]> {
    const { maturity, currencyId, fCashPV } = contractPosition.dataProps;
    const portfolio = await contract.read.getAccountPortfolio([address]);
    const supplyPositions = portfolio.filter(v => v.notional >= 0);
    const position = supplyPositions.find(v => Number(v.maturity) === maturity && Number(v.currencyId) === currencyId);
    if (!position) return [0];

    const fcashAmountAtMaturity = new BigNumber(position.notional.toString())
      .times(10 ** contractPosition.tokens[0].decimals)
      .div(10 ** 8);

    const presentValue = fcashAmountAtMaturity.times(new BigNumber(fCashPV));

    return [presentValue.toString()];
  }
}
