import { BigNumber, BigNumberish, Contract } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
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

export type RariFuseBorrowContractPositionDataProps = {
  apy: number;
  liquidity: number;
  marketName: string;
  comptroller: string;
};

export type RariFuseBorrowContractPositionDefinition = {
  address: string;
  marketName: string;
  comptroller: string;
};

export abstract class RariFuseBorrowContractPositionFetcher<
  T extends Contract,
  V extends Contract,
  R extends Contract,
  S extends Contract,
> extends ContractPositionTemplatePositionFetcher<
  R,
  RariFuseBorrowContractPositionDataProps,
  RariFuseBorrowContractPositionDefinition
> {
  abstract poolDirectoryAddress: string;
  abstract lensAddress: string;

  abstract getPoolDirectoryContract(address: string): T;
  abstract getComptrollerContract(address: string): V;
  abstract getTokenContract(address: string): R;
  abstract getLensContract(address: string): S;

  abstract getPools(contract: T): Promise<{ name: string; comptroller: string }[]>;
  abstract getMarketTokenAddresses(contract: V): Promise<string[]>;
  abstract getUnderlyingTokenAddress(contract: R): Promise<string>;
  abstract getBorrowRateRaw(contract: R): Promise<BigNumberish>;
  abstract getTotalBorrows(contract: R): Promise<BigNumberish>;
  abstract getBorrowBalance(address: string, contract: R): Promise<BigNumberish>;
  abstract getPoolsBySupplier(address: string, contract: S): Promise<[BigNumber[], { comptroller: string }[]]>;

  getContract(address: string): R {
    return this.getTokenContract(address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<RariFuseBorrowContractPositionDefinition[]> {
    const poolDirectory = this.getPoolDirectoryContract(this.poolDirectoryAddress);
    const pools = await this.getPools(poolDirectory);

    const definitions = await Promise.all(
      pools.map(async pool => {
        const comptroller = multicall.wrap(this.getComptrollerContract(pool.comptroller));
        const marketAddresses = await this.getMarketTokenAddresses(comptroller);

        return marketAddresses.map(marketAddress => ({
          address: marketAddress.toLowerCase(),
          comptroller: pool.comptroller.toLowerCase(),
          marketName: pool.name,
        }));
      }),
    );

    return definitions.flat();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<R>) {
    return [{ metaType: MetaType.BORROWED, address: await this.getUnderlyingTokenAddress(contract) }];
  }

  async getDataProps({
    contract,
    contractPosition,
    definition,
  }: GetDataPropsParams<R, RariFuseBorrowContractPositionDataProps, RariFuseBorrowContractPositionDefinition>) {
    const [totalBorrowsRaw, borrowRateRaw] = await Promise.all([
      this.getTotalBorrows(contract),
      this.getBorrowRateRaw(contract),
    ]);

    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const { marketName, comptroller } = definition;
    const borrowRate = Number(borrowRateRaw) / 10 ** 18;
    const apy = (Math.pow(1 + blocksPerDay * borrowRate, 365) - 1) * 100;
    const liquidity = (-1 * Number(totalBorrowsRaw)) / 10 ** contractPosition.tokens[0].decimals;

    return { apy, liquidity, marketName, comptroller };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<R>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<R>) {
    return [
      await this.getBorrowBalance(address, contract).catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      }),
    ];
  }

  async getBalances(address: string): Promise<ContractPositionBalance<RariFuseBorrowContractPositionDataProps>[]> {
    const lens = this.getLensContract(this.lensAddress);
    const poolsBySupplier = await this.getPoolsBySupplier(address, lens);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<RariFuseBorrowContractPositionDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions
        .filter(v => participatedComptrollers.includes(v.dataProps.comptroller))
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
