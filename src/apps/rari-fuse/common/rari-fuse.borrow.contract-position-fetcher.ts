import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { RariFuseContractFactory } from '../contracts';
import { RariFuseToken } from '../contracts/ethers/RariFuseToken';

export type RariFuseBorrowContractPositionDataProps = {
  apy: number;
  liquidity: number;
  marketName: string;
  comptrollerAddress: string;
};

export type RariFuseBorrowContractPositionDefinition = {
  address: string;
  marketName: string;
};

export abstract class RariFuseBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  RariFuseToken,
  RariFuseBorrowContractPositionDataProps,
  RariFuseBorrowContractPositionDefinition
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

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<RariFuseBorrowContractPositionDefinition[]> {
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

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<RariFuseToken>) {
    return [{ metaType: MetaType.BORROWED, address: await contract.underlying() }];
  }

  async getDataProps({
    contract,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    RariFuseToken,
    RariFuseBorrowContractPositionDataProps,
    RariFuseBorrowContractPositionDefinition
  >) {
    const [comptrollerAddressRaw, totalBorrowsRaw, borrowRateRaw] = await Promise.all([
      contract.comptroller(),
      contract.totalBorrows(),
      contract.borrowRatePerBlock(),
    ]);

    const comptrollerAddress = comptrollerAddressRaw.toLowerCase();
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const { marketName } = definition;
    const apy = Math.pow(1 + (blocksPerDay * Number(borrowRateRaw)) / Number(1e18), 365) - 1;
    const liquidity = (-1 * Number(totalBorrowsRaw)) / 10 ** contractPosition.tokens[0].decimals;

    return { apy, liquidity, marketName, comptrollerAddress };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RariFuseToken>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<RariFuseToken>) {
    return [
      await contract.borrowBalanceCurrent(address).catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      }),
    ];
  }

  async getBalances(address: string): Promise<ContractPositionBalance<RariFuseBorrowContractPositionDataProps>[]> {
    // @TODO Would be better to call super.getBalances(), but what is the abstraction for the subset of tokens?
    const fuseLensAddress = '0x8da38681826f4abbe089643d2b3fe4c6e4730493';
    const fuseLens = this.contractFactory.rariFusePoolLens({ address: fuseLensAddress, network: this.network });
    const poolsBySupplier = await fuseLens.getPoolsBySupplier(address);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<RariFuseBorrowContractPositionDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions
        .filter(v => participatedComptrollers.includes(v.dataProps.comptrollerAddress))
        .map(async contractPosition => {
          const contract = multicall.wrap(this.getContract(contractPosition.address));
          const balancesRaw = await this.getTokenBalancesPerPosition({
            address,
            contract,
            contractPosition,
            multicall,
          });

          const allTokens = contractPosition.tokens.map((cp, idx) =>
            drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
          );

          const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
          const balanceUSD = sumBy(tokens, t => t.balanceUSD);

          const balance: ContractPositionBalance<RariFuseBorrowContractPositionDataProps> = {
            ...contractPosition,
            tokens,
            balanceUSD,
          };
          return balance;
        }),
    );

    return balances;
  }
}
