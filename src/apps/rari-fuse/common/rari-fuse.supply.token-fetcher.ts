import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetDefinitionsParams,
} from '~position/template/app-token.template.types';

import { RariFuseContractFactory } from '../contracts';
import { RariFuseToken } from '../contracts/ethers/RariFuseToken';

export type RariFuseSupplyTokenDataProps = {
  apy: number;
  liquidity: number;
  marketName: string;
  comptrollerAddress: string;
};

export type RariFuseSupplyTokenDefinition = {
  address: string;
  marketName: string;
};

export abstract class RariFuseSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<
  RariFuseToken,
  RariFuseSupplyTokenDataProps,
  RariFuseSupplyTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariFuseContractFactory) protected readonly contractFactory: RariFuseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RariFuseToken {
    return this.contractFactory.rariFuseToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const poolDirectoryAddress = '0x835482fe0532f169024d5e9410199369aad5c77e';
    const poolDirectory = this.contractFactory.rariFusePoolsDirectory({
      address: poolDirectoryAddress,
      network: this.network,
    });

    const pools = await poolDirectory.getAllPools();

    const definitions = await Promise.all(
      pools.map(async pool => {
        const comptroller = this.contractFactory.rariFuseComptroller({
          address: pool.comptroller,
          network: this.network,
        });

        const marketAddresses = await multicall.wrap(comptroller).getAllMarkets();
        return marketAddresses.map(marketAddress => ({
          address: marketAddress,
          marketName: pool.name,
        }));
      }),
    );

    return definitions.flat();
  }

  async getAddresses({ definitions }: { multicall: IMulticallWrapper; definitions: RariFuseSupplyTokenDefinition[] }) {
    return definitions.map(v => v.address);
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<RariFuseToken>) {
    return contract.underlying();
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<RariFuseToken, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    const mantissa = 18 + appToken.tokens[0]!.decimals - appToken.decimals;
    return contract
      .exchangeRateCurrent()
      .then(v => Number(v) / 10 ** mantissa)
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }

  async getDataProps({
    contract,
    definition,
    appToken,
  }: GetDataPropsParams<RariFuseToken, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    const [comptrollerAddressRaw, supplyRateRaw] = await Promise.all([
      contract.comptroller(),
      contract.supplyRatePerBlock(),
    ]);

    const comptrollerAddress = comptrollerAddressRaw.toLowerCase();
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const marketName = definition.marketName;
    const apy = Math.pow(1 + (blocksPerDay * Number(supplyRateRaw)) / Number(1e18), 365) - 1;
    const liquidity = appToken.price * appToken.supply;

    return { apy, liquidity, marketName, comptrollerAddress };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<RariFuseToken, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<RariFuseToken, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    return appToken.symbol;
  }

  async getBalanceDisplayMode() {
    return BalanceDisplayMode.UNDERLYING;
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<RariFuseSupplyTokenDataProps>[]> {
    // @TODO Would be better to call super.getBalances(), but what is the abstraction for the subset of tokens?

    const fuseLensAddress = '0x8da38681826f4abbe089643d2b3fe4c6e4730493';
    const fuseLens = this.contractFactory.rariFusePoolLens({ address: fuseLensAddress, network: this.network });
    const poolsBySupplier = await fuseLens.getPoolsBySupplier(address);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<RariFuseSupplyTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      appTokens
        .filter(v => participatedComptrollers.includes(v.dataProps.comptrollerAddress))
        .map(async appToken => {
          const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
          const tokenBalance = drillBalance(appToken, balanceRaw.toString());
          return tokenBalance;
        }),
    );

    return balances as AppTokenPositionBalance<RariFuseSupplyTokenDataProps>[];
  }
}
