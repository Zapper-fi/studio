import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { ethers } from 'ethers';

import { AppDefinition } from '~app/app.definition';
import { IContractFactory } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenPosition, ContractPosition, NonFungibleToken } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { AppToolkitHelperRegistry } from './app-toolkit.helpers';

export const APP_TOOLKIT = Symbol('APP_TOOLKIT');

export interface IAppToolkit {
  // Apps
  getApps(): Promise<AppDefinition[]>;

  getApp(appId: string): Promise<AppDefinition | undefined>;

  // Network Related
  get globalContracts(): IContractFactory;

  getNetworkProvider(network: Network): StaticJsonRpcProvider;

  getMulticall(network: Network): IMulticallWrapper;

  // Base Tokens

  getBaseTokenPrices(network: Network): Promise<BaseToken[]>;

  getBaseTokenPrice(opts: { network: Network; address: string }): Promise<BaseToken | null>;

  // Positions

  getAppTokenPositions<T = DefaultDataProps>(
    ...appTokenDefinition: AppGroupsDefinition[]
  ): Promise<AppTokenPosition<T>[]>;

  getAppContractPositions<T = DefaultDataProps>(
    ...appTokenDefinition: AppGroupsDefinition[]
  ): Promise<ContractPosition<T>[]>;

  // Position Key

  getPositionKey(
    position: ContractPosition | AppTokenPosition | BaseToken | NonFungibleToken,
    pickFields?: string[],
  ): string;

  // Cache

  getFromCache<T = any>(key: string): Promise<T | undefined>;
  setManyToCache<T = any>(entries: [string, T][], ttl?: number): Promise<void>;

  // Global Helpers

  get helpers(): AppToolkitHelperRegistry;

  getBigNumber(source: BigNumberJS.Value | ethers.BigNumber): BigNumberJS;
}
