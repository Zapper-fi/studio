import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { gql, GraphQLClient } from 'graphql-request';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DolomiteContractFactory, DolomiteMargin } from '~apps/dolomite/contracts';
import {
  CHUNK_SIZE,
  chunkArrayForMultiCall,
  DOLOMITE_GRAPH_ENDPOINT,
  DOLOMITE_MARGIN_ADDRESSES,
  DolomiteContractPositionDefinition,
  ExtraTokenInfo,
  ISOLATION_MODE_MATCHERS,
  SILO_MODE_MATCHERS,
  SPECIAL_TOKEN_NAME_MATCHERS,
  TokenMode,
  AccountStruct,
  DolomiteContractPosition,
  DolomiteDataProps,
  getAllIsolationModeTokensFromContractPositions,
  getTokenBalancesPerAccountStructLib,
  getTokenDefinitionsLib,
  mapTokensToDolomiteDataProps,
} from '~apps/dolomite/utils';
import { Erc20__factory } from '~contract/contracts/ethers';
import { IMulticallWrapper } from '~multicall';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

export abstract class DolomiteContractPositionTemplatePositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  DolomiteMargin,
  DolomiteDataProps,
  DolomiteContractPositionDefinition
> {
  protected constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) protected readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  protected abstract isFetchingDolomiteBalances(): boolean;
  getContract(address: string): DolomiteMargin {
    return this.dolomiteContractFactory.dolomiteMargin({ address, network: this.network });
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<DolomiteContractPositionDefinition[]> {
    const dolomiteMargin = this.getContract(DOLOMITE_MARGIN_ADDRESSES[this.network]);
    const marketsCount = (await dolomiteMargin.getNumMarkets()).toNumber();

    const underlyingTokenAddressCallChunks = chunkArrayForMultiCall(
      Array.from({ length: marketsCount }, (_, i) => i),
      (_, i) => ({
        target: dolomiteMargin.address,
        callData: dolomiteMargin.interface.encodeFunctionData('getMarketTokenAddress', [i]),
      }),
    );
    const underlyingTokenAddresses: string[] = [];
    for (let i = 0; i < underlyingTokenAddressCallChunks.length; i++) {
      const { returnData } = await params.multicall.contract.callStatic.aggregate(
        underlyingTokenAddressCallChunks[i],
        false,
      );
      returnData.forEach(({ data }) => {
        const result = ethers.utils.defaultAbiCoder.decode(['address'], data);
        underlyingTokenAddresses.push((result[0] as string).toLowerCase());
      });
    }

    const tokenNameCallChunks = chunkArrayForMultiCall(underlyingTokenAddresses, tokenAddress => ({
      target: tokenAddress,
      callData: Erc20__factory.createInterface().encodeFunctionData('name'),
    }));
    const tokenNames: string[] = [];
    for (let i = 0; i < tokenNameCallChunks.length; i++) {
      const { returnData } = await params.multicall.contract.callStatic.aggregate(tokenNameCallChunks[i], false);
      returnData.forEach(({ data }) => {
        const result = ethers.utils.defaultAbiCoder.decode(['string'], data);
        tokenNames.push(result[0] as string);
      });
    }

    const wrappedTokenAddresses: string[] = [];
    const modes: TokenMode[] = [];
    for (let i = 0; i < underlyingTokenAddresses.length; i++) {
      wrappedTokenAddresses.push(underlyingTokenAddresses[i]);
      const tokenName = tokenNames[i];
      if (SPECIAL_TOKEN_NAME_MATCHERS.some(matcher => tokenName.includes(matcher))) {
        modes[i] = ISOLATION_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
          ? TokenMode.ISOLATION
          : SILO_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
          ? TokenMode.SILO
          : TokenMode.NORMAL;
        const isolationModeTokenContract = this.dolomiteContractFactory.isolationModeToken({
          address: underlyingTokenAddresses[i],
          network: this.network,
        });
        if (tokenName.includes('Fee + Staked GLP')) {
          // special edge-case for fee + staked GLP token.
          underlyingTokenAddresses[i] = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
        } else {
          underlyingTokenAddresses[i] = (await isolationModeTokenContract.UNDERLYING_TOKEN()).toLowerCase();
        }
      } else {
        modes.push(TokenMode.NORMAL);
      }
    }

    const marketIdToMarketMap = wrappedTokenAddresses.reduce<Record<number, ExtraTokenInfo>>(
      (memo, wrappedTokenAddress, i) => {
        memo[i] = {
          underlyingTokenAddress: underlyingTokenAddresses[i],
          wrappedTokenAddress,
          mode: modes[i],
          name: tokenNames[i],
          marketId: i,
        };
        return memo;
      },
      {},
    );

    return [
      {
        address: dolomiteMargin.address,
        marketsCount: marketsCount,
        marketIdToMarketMap: marketIdToMarketMap,
      },
    ];
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<DolomiteMargin, DolomiteContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return getTokenDefinitionsLib(params, this.dolomiteContractFactory, this.network);
  }

  async getDataProps(
    params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps, DolomiteContractPositionDefinition>,
  ): Promise<DolomiteDataProps> {
    const multicall = this.appToolkit.getMulticall(this.network);
    return mapTokensToDolomiteDataProps(params, this.isFetchingDolomiteBalances(), this.network, multicall);
  }

  async getLabel(params: GetDisplayPropsParams<DolomiteMargin>): Promise<string> {
    const label = getLabelFromToken(params.contractPosition.tokens[0]);
    return label.replace('WETH', 'ETH');
  }
  async getBalances(address: string): Promise<ContractPositionBalance<DolomiteDataProps>[]> {
    if (address === ZERO_ADDRESS) {
      return [];
    }

    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.getPositionsForBalances(address, multicall);

    return await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balanceMap: Map<string, BigNumber> = new Map();
        for (let i = 0; i < contractPosition.accountStructs.length; i++) {
          const accountStruct = contractPosition.accountStructs[i];
          const innerBalanceMap = await this.getTokenBalancesPerAccountStruct(
            { address: accountStruct.accountOwner, contract, contractPosition, multicall },
            accountStruct,
          );
          innerBalanceMap.forEach((value, key) => {
            if (!balanceMap.has(key)) {
              balanceMap.set(key, BigNumber.from(0));
            }
            balanceMap.set(key, balanceMap.get(key)!.add(value));
          });
          if (!this.isFetchingDolomiteBalances()) {
            // we're getting isolated borrow positions. Generate a unique key based on the account owner / number
            contractPosition.dataProps.positionKey = `${accountStruct.accountOwner}-${accountStruct.accountNumber}`;
            contractPosition.key = this.appToolkit.getPositionKey(contractPosition);
          }
        }
        const allTokens = contractPosition.tokens.map(cp => {
          const balance = balanceMap.get(cp.address) || BigNumber.from(0);
          if (balance.lt(0)) {
            cp.metaType = MetaType.BORROWED;
          }
          return drillBalance(cp, balance.abs()?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED });
        });

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance<DolomiteDataProps> = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );
  }

  async getPositionsForBalances(account: string, multicall: IMulticallWrapper): Promise<DolomiteContractPosition[]> {
    const defaultContractPositions = await this.appToolkit.getAppContractPositions<DolomiteDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (this.isFetchingDolomiteBalances()) {
      const isolationModeVaults = await getAllIsolationModeTokensFromContractPositions(
        account,
        defaultContractPositions,
        multicall,
      );
      const isolationModeAccountStructs = isolationModeVaults.map<AccountStruct>(vault => ({
        accountOwner: vault,
        accountNumber: '0',
      }));

      const tokenLoader = this.appToolkit.getTokenDependencySelector({
        tags: { network: this.network, context: `${this.appId}__template` },
      });
      const definitions = await this.getDefinitions({ multicall, tokenLoader });
      const tokenCount = (await this.getContract(definitions[0].address).getNumMarkets()).toNumber();
      const accounts: AccountStruct[] = [];
      for (let i = 0; i < tokenCount; i += CHUNK_SIZE) {
        accounts.push({ accountOwner: account, accountNumber: BigNumber.from(i).div(CHUNK_SIZE).toString() });
      }

      return [
        {
          ...defaultContractPositions[0],
          accountStructs: [...accounts, ...isolationModeAccountStructs],
        },
      ];
    } else {
      const client = new GraphQLClient(DOLOMITE_GRAPH_ENDPOINT, {
        headers: { 'Content-Type': 'application/json' },
      });
      const isolationModeVaults = await getAllIsolationModeTokensFromContractPositions(
        account,
        defaultContractPositions,
        multicall,
      );
      const query = gql`
        query getMarginAccounts($walletAddress: String!) {
          marginAccounts(
            where: { user_contains_nocase: $walletAddress, accountNumber_gt: "100", hasSupplyValue: true }
          ) {
            user {
              id
            }
            accountNumber
          }
        }
      `;
      const accountStructs: AccountStruct[] = [];
      const allAccounts = [account, ...isolationModeVaults];
      for (let i = 0; i < allAccounts.length; i++) {
        const result = await client.request(query, { walletAddress: allAccounts[i] });
        result?.marginAccounts?.forEach(account => {
          accountStructs.push({
            accountOwner: account.user.id,
            accountNumber: account.accountNumber as string,
          });
        });
      }

      const positions: DolomiteContractPosition[] = [];
      for (let i = 0; i < accountStructs.length; i++) {
        const contractPositions = await this.appToolkit.getAppContractPositions<DolomiteDataProps>({
          appId: this.appId,
          network: this.network,
          groupIds: [this.groupId],
        });
        positions[i] = {
          ...contractPositions[0],
          accountStructs: [accountStructs[i]],
        };
      }
      return positions;
    }
  }

  getTokenBalancesPerPosition(_params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>): never {
    throw new Error('Not implemented');
  }

  async getTokenBalancesPerAccountStruct(
    params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>,
    accountStruct: AccountStruct,
  ): Promise<Map<string, BigNumberish>> {
    return getTokenBalancesPerAccountStructLib(params, accountStruct);
  }
}
