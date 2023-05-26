import { parseBytes32String } from '@ethersproject/strings';
import { Inject } from '@nestjs/common';
import { flatMap } from 'lodash';

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

import { RigoblockContractFactory, SmartPool } from '../contracts';

import { PoolLogType, RigoblockLogProvider } from './rigoblock.log-provider';
import { POOL_BUILDERS } from './rigoblock.pool.pool-builders';

type RigoblockSmartPoolDefinition = DefaultAppTokenDefinition & {
  logType: PoolLogType;
  address: string;
  name: string;
};

type WhitelistedTokenDefinition = DefaultAppTokenDefinition & {
  logType: PoolLogType;
  address: string;
};

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

  // some tokens on L2s don't have a price feed on CG
  abstract blockedTokenAddresses: string[];

  extraDefinitions: RigoblockSmartPoolDefinition[] = [];

  async getDefinitions(): Promise<RigoblockSmartPoolDefinition[]> {
    const poolBuilders = POOL_BUILDERS[this.network] ?? [];

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

  async getTokenList(): Promise<WhitelistedTokenDefinition[]> {
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

  async getUnderlyingTokenDefinitions() {
    const results = [...new Set(await this.getTokenList())];

    // we make sure no token duplicates are in the list
    return results
      .map(x => ({ address: x.address.toLowerCase(), network: this.network }))
      .filter(v => !this.blockedTokenAddresses.includes(v.address));
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
