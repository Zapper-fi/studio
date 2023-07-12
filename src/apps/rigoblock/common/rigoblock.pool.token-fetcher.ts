import { parseBytes32String } from '@ethersproject/strings';
import { BigNumber } from 'ethers';
import { Inject } from '@nestjs/common';
import { compact, flatMap } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';
import { BaseToken } from '~position/token.interface';

import { RigoblockContractFactory, SmartPool } from '../contracts';

import { PoolLogType, RigoblockLogProvider } from './rigoblock.log-provider';
import { POOL_BUILDERS } from './rigoblock.pool.pool-builders';

type RigoblockSmartPoolDefinition = DefaultAppTokenDefinition & {
  logType: PoolLogType;
  address: string;
  name: string;
  tokenList?: WhitelistedTokenDefinition[];
};

type WhitelistedTokenDefinition = DefaultAppTokenDefinition & {
  logType: PoolLogType;
  address: string;
};

type RToken = BaseToken & {
  hide: boolean;
}

export abstract class RigoblockPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  SmartPool,
  DefaultAppTokenDataProps,
  RigoblockSmartPoolDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory,
    @Inject(RigoblockLogProvider) private readonly logProvider: RigoblockLogProvider,
  ) {
    super(appToolkit);
  }

  extraDefinitions: RigoblockSmartPoolDefinition[] = [];

  async getDefinitions(): Promise<RigoblockSmartPoolDefinition[]> {
    const poolBuilders = POOL_BUILDERS[this.network] ?? [];
    // we query tracked tokens here to save redundant calls
    const tokenList = await this.getTokenList()

    // Get all logs for each pool builder contract
    const builderLogs = await Promise.all(
      poolBuilders.map(({ registryAddress, blockNumber }) =>
        this.logProvider.getRigoblockLogs({
          fromBlock: blockNumber,
          address: registryAddress.toLowerCase(),
          network: this.network,
          logType: PoolLogType.REGISTERED,
        }),
      ),
    );
    const definitions = await Promise.all(
      builderLogs.flatMap(logs =>
        flatMap(logs, (logsForType, logType: PoolLogType) =>
          logsForType.map(async log => {
            const poolAddress = log.args[1].toLowerCase();
            const name = log.args[2].toLowerCase();

            return {
              logType,
              address: poolAddress,
              name: parseBytes32String(name),
              tokenList,
            };
          }),
        ),
      ),
    );
    return [...definitions, ...this.extraDefinitions];
  }

  async getAddresses({ definitions }: GetAddressesParams<RigoblockSmartPoolDefinition>): Promise<string[]> {
    return definitions.map(definition => definition.address);
  }

  getContract(address: string): SmartPool {
    return this.contractFactory.smartPool({ address, network: this.network });
  }

  // whitelisted tokens are filtered by those that are not tracked
  async getTokenList(): Promise<WhitelistedTokenDefinition[]> {
    const tokenList = [...new Set(await this.getTokenWhitelist())];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network) as RToken[];
    const trackedTokens = tokenList.map(token => {
      const tokenFound = baseTokens.find(p => p.address === token.address && !p.hide);
      if (!tokenFound) return null;
      return token;
    });
    return compact(trackedTokens);
  }

  async getTokenWhitelist(): Promise<WhitelistedTokenDefinition[]> {
    const tokenBuilders = POOL_BUILDERS[this.network] ?? [];

    const tokenLogs = await Promise.all(
      tokenBuilders.map(({ tokenWhitelistAddress, blockNumber }) =>
        this.logProvider.getRigoblockLogs({
          fromBlock: blockNumber,
          address: tokenWhitelistAddress.toLowerCase(),
          network: this.network,
          logType: PoolLogType.TOKEN_WHITELISTED,
        }),
      ),
    );

    return await Promise.all(
      tokenLogs.flatMap(logs =>
        flatMap(logs, (logsForType, logType: PoolLogType) =>
          logsForType.map(async log => {
            const tokenAddress = log.args[0].toLowerCase();

            return {
              logType,
              address: tokenAddress,
            };
          }),
        ),
      ),
    );
  }

  async getUnderlyingTokenDefinitions({
    multicall,
    definition
  }: GetDisplayPropsParams<SmartPool, DefaultDataProps, RigoblockSmartPoolDefinition>) {
    // this block returns only held tokens. However, it would require less RPC calls to just multicall
    //  all tokens and display in UI only tokens with positive balances.
    const tokens = definition.tokenList
    if(!tokens || tokens?.length === 0) return[]
    let heldTokens: WhitelistedTokenDefinition[] = []
    for (let i = 0; i !== tokens.length; i++) {
      const uTokenContract = this.contractFactory.erc20({ address: tokens[i].address, network: this.network });
      const poolTokenBalance = await multicall.wrap(uTokenContract).balanceOf(definition.address);
      if (poolTokenBalance && poolTokenBalance.gt(BigNumber.from(0))) { heldTokens[i] = tokens[i] };
    }

    return compact(heldTokens)
      .map(x => ({ address: x.address.toLowerCase(), network: this.network }))
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetPricePerShareParams<SmartPool, DefaultAppTokenDataProps, RigoblockSmartPoolDefinition>) {
    if (appToken.supply === 0) return appToken.tokens.map(() => 0);

    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const uTokenContract = this.contractFactory.erc20({ address: token.address, network: this.network });
        const reserveRaw = await multicall.wrap(uTokenContract).balanceOf(appToken.address);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => {
      return r == 0 ? 0 : r / appToken.supply;
    });
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<SmartPool, DefaultDataProps, RigoblockSmartPoolDefinition>): Promise<string> {
    return definition.name;
  }
}
