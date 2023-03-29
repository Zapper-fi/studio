import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { gql, GraphQLClient } from 'graphql-request';
import { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DolomiteContractFactory, DolomiteMargin } from '~apps/dolomite/contracts';
import { CHUNK_SIZE, DOLOMITE_GRAPH_ENDPOINT, DOLOMITE_MARGIN_ADDRESSES } from '~apps/dolomite/utils';
import {
  AccountStruct,
  DolomiteContractPosition,
  DolomiteDataProps,
  DolomiteTokenDefinition,
  getAllIsolationModeTokensFromContractPositions,
  getTokenBalancesPerAccountStructLib,
  getTokenDefinitionsLib,
  mapTokensToDolomiteDataProps,
} from '~apps/dolomite/utils';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { metatyped } from '~position/position.utils';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

export abstract class DolomiteContractPositionTemplatePositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  DolomiteMargin,
  DolomiteDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) protected readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  protected abstract isFetchingDolomiteBalances(): boolean;
  getContract(address: string): DolomiteMargin {
    return this.dolomiteContractFactory.dolomiteMargin({ address, network: this.network });
  }

  getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return Promise.resolve([
      {
        address: DOLOMITE_MARGIN_ADDRESSES[this.network],
      },
    ]);
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<DolomiteMargin>,
  ): Promise<DolomiteTokenDefinition[] | null> {
    return getTokenDefinitionsLib(params, this.dolomiteContractFactory, this.network);
  }
  override async getPositions() {
    // copy-paste the original function but allow us to use our own token definition for the call to
    // `this.getDolomiteDataProps` to reduce the number of redundant calls
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const definitions = await this.getDefinitions({ multicall, tokenLoader });

    const skeletons = await Promise.all(
      definitions.map(async definition => {
        const address = definition.address.toLowerCase();
        const contract = multicall.wrap(this.getContract(definition.address));
        const context = { address, contract, definition, multicall, tokenLoader };

        const maybeTokenDefinitions = await this.getTokenDefinitions(context);
        if (!maybeTokenDefinitions) return null;

        const tokenDefinitionsArr = Array.isArray(maybeTokenDefinitions)
          ? maybeTokenDefinitions
          : [maybeTokenDefinitions];
        const tokenDefinitions = tokenDefinitionsArr.map(t => ({ ...t, address: t.address.toLowerCase() }));

        return { address, definition, tokenDefinitions };
      }),
    );

    // use the tokenDefinitions passed through from above
    const underlyingTokenRequests = compact(skeletons).flatMap(v => v.tokenDefinitions);
    const tokenDependencies = await tokenLoader.getMany(underlyingTokenRequests).then(tokenDeps => compact(tokenDeps));

    const skeletonsWithResolvedTokens = await Promise.all(
      compact(skeletons).map(({ address, tokenDefinitions, definition }) => {
        const maybeTokens = tokenDefinitions.map(definition => {
          const match = tokenDependencies.find(token => {
            const isAddressMatch = token.address === definition.address;
            const isNetworkMatch = token.network == definition.network;
            const isMaybeErc1155TokenIdMatch =
              !definition.tokenId ||
              (token.type === ContractType.APP_TOKEN && token.dataProps.tokenId === definition.tokenId);
            return isAddressMatch && isNetworkMatch && isMaybeErc1155TokenIdMatch;
          });

          if (match) {
            const tokenWithMetaType = metatyped(match, definition.metaType);

            // Since the key generation is stateful and the key is already generated for an app token, we need to
            // regenerate the key for underlying app tokens. Otherwise, we may end up in situations where underlying
            // app tokens balances are double counted.
            if (tokenWithMetaType.type === ContractType.APP_TOKEN) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { key, ...token } = tokenWithMetaType;
              return { ...token, key: this.appToolkit.getPositionKey(token) };
            }

            return tokenWithMetaType;
          }
          return null;
        });

        const tokens = compact(maybeTokens);
        if (maybeTokens.length !== tokens.length) return null;
        return { address, tokens, definition };
      }),
    );

    return Promise.all(
      compact(skeletonsWithResolvedTokens).map(async ({ address, tokens, definition }) => {
        const contract = multicall.wrap(this.getContract(address));
        const baseContext = { address, contract, multicall, tokenLoader, definition };

        const baseFragment: GetDataPropsParams<DolomiteMargin, DolomiteDataProps>['contractPosition'] = {
          type: ContractType.POSITION,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          tokens,
        };

        // Resolve Data Props Stage
        const dataPropsStageParams = { ...baseContext, contractPosition: baseFragment };
        const dataProps = await this.getDolomiteDataProps(dataPropsStageParams, underlyingTokenRequests);

        // Resolve Display Props Stage
        const displayPropsStageFragment = { ...baseFragment, dataProps };
        const displayPropsStageParams = { ...dataPropsStageParams, contractPosition: displayPropsStageFragment };
        const displayProps = {
          label: await this.getLabel(displayPropsStageParams),
          labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
          secondaryLabel: await this.getSecondaryLabel(displayPropsStageParams),
          tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
          images: await this.getImages(displayPropsStageParams),
          statsItems: await this.getStatsItems(displayPropsStageParams),
        };

        const contractPosition = { ...baseFragment, dataProps, displayProps };
        const key = this.appToolkit.getPositionKey(contractPosition);
        return { ...contractPosition, key };
      }),
    );
  }

  async getDolomiteDataProps(
    params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps>,
    tokenDefinitions: DolomiteTokenDefinition[],
  ): Promise<DolomiteDataProps> {
    const multicall = this.appToolkit.getMulticall(this.network);
    return mapTokensToDolomiteDataProps(
      params,
      tokenDefinitions,
      this.isFetchingDolomiteBalances(),
      this.network,
      multicall,
    );
  }

  async getLabel(_params: GetDisplayPropsParams<DolomiteMargin>): Promise<string> {
    return this.groupLabel;
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
