import { parseBytes32String } from '@ethersproject/strings'
import { Inject } from '@nestjs/common';
import { flatMap } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { RigoblockContractFactory, SmartPool } from '../contracts';

import { RigoblockLogProvider } from '../common/rigoblock.log-provider';
import { POOL_BUILDERS } from '../common/rigoblock.pool.pool-builders';

export enum PoolLogType {
  REGISTERED = 'registered',
  TOKEN_WHITELISTED = 'whitelisted',
}

type RigoblockSmartPoolDefinition = DefaultAppTokenDefinition & {
  type: PoolLogType;
  poolAddress: string;
  name: string;
};

@PositionTemplate()
export class EthereumRigoblockPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  SmartPool,
  RigoblockSmartPoolDefinition
> {
  groupLabel: string = 'SmartPool';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory,
    @Inject(RigoblockLogProvider) private readonly logProvider: RigoblockLogProvider,
  ) {
    super(appToolkit);
  }

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
          label: PoolLogType.REGISTERED,
        }),
      ),
    );
    const definitions = await Promise.all(
      builderLogs.flatMap(logs =>
        flatMap(logs, (logsForType, type: PoolLogType) =>
          logsForType.map(async log => {
            const poolAddress = log.args[1].toLowerCase();
            const name = log.args[2].toLowerCase();

            return {
              type,
              address: poolAddress,
              name: parseBytes32String(name),
            };
          }),
        ),
      ),
    );
    return [...definitions, ...this.extraDefinitions];
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  getContract(address: string): SmartPool {
    return this.contractFactory.smartPool({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions(): Promise<string> {
    return [{ address: '0x4fbb350052bca5417566f188eb2ebce5b19bc964', network: this.network }];
  }

  async getPricePerShare({
    appToken,
    multicall
  }): GetPricePerShareParams<SmartPool, DefaultAppTokenDataProps, DefaultAppTokenDefinition> {
    if (appToken.supply === 0) return appToken.tokens.map(() => 0);

    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const uTokenContract = this.contractFactory.erc20({ address: token.address, network: this.network });
        const reserveRaw = await multicall.wrap(uTokenContract).balanceOf(appToken.address);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => r / appToken.supply);
    //return [1];
  }

  async getLabel({ definition }): Promise<string> {
    return definition.name;
  }
}
