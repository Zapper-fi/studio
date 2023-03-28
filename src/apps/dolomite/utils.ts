import { BigNumber, BigNumberish, ethers } from 'ethers';
import { compact } from 'lodash';

import { DolomiteContractFactory, DolomiteMargin } from '~apps/dolomite/contracts';
import {
  chunkArrayForMultiCall,
  ISOLATION_MODE_MATCHERS,
  SILO_MODE_MATCHERS,
  SPECIAL_TOKEN_NAME_MATCHERS,
} from '~apps/dolomite/dolomite.module';
import { Erc20__factory } from '~contract/contracts/ethers';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import { MetaType, Token } from '~position/position.interface';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

export enum TokenMode {
  NORMAL = 'NORMAL',
  ISOLATION = 'ISOLATION',
  SILO = 'SILO',
}

export interface DolomiteDataProps extends DefaultDataProps {
  [tokenAddress: string]: {
    wrappedTokenAddress: string;
    name: string;
    mode: TokenMode;
    marketId: number;
  };
}

export interface DolomiteTokenDefinition extends UnderlyingTokenDefinition {
  wrappedTokenAddress: string;
  mode: TokenMode;
  name: string;
}

export async function getTokenDefinitionsLib(
  params: GetTokenDefinitionsParams<DolomiteMargin>,
  dolomiteContractFactory: DolomiteContractFactory,
  network: Network,
  isPositive: boolean,
): Promise<DolomiteTokenDefinition[]> {
  const tokenCount = (await params.contract.getNumMarkets()).toNumber();

  const tokenAddressCallChunks = chunkArrayForMultiCall(
    Array.from({ length: tokenCount }, (_, i) => i),
    (_, i) => ({
      target: params.address,
      callData: params.contract.interface.encodeFunctionData('getMarketTokenAddress', [i]),
    }),
  );
  let tokenAddresses: string[] = [];
  for (let i = 0; i < tokenAddressCallChunks.length; i++) {
    const { returnData } = await params.multicall.contract.callStatic.aggregate(tokenAddressCallChunks[i], false);
    const rawTokens = returnData.map(({ data }): string => {
      return (ethers.utils.defaultAbiCoder.decode(['address'], data)[0] as string).toLowerCase();
    });
    tokenAddresses = tokenAddresses.concat(...rawTokens);
  }

  const tokenNameCallChunks = chunkArrayForMultiCall(tokenAddresses, tokenAddress => ({
    target: tokenAddress,
    callData: Erc20__factory.createInterface().encodeFunctionData('name'),
  }));
  let tokenNames: string[] = [];
  for (let i = 0; i < tokenNameCallChunks.length; i++) {
    const { returnData } = await params.multicall.contract.callStatic.aggregate(tokenNameCallChunks[i], false);
    const rawTokens = returnData.map(({ data }): string => {
      return ethers.utils.defaultAbiCoder.decode(['string'], data)[0] as string;
    });
    tokenNames = tokenNames.concat(...rawTokens);
  }

  const wrappedTokenAddresses: string[] = [];
  const modes: TokenMode[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    wrappedTokenAddresses.push(tokenAddresses[i]);
    const tokenName = tokenNames[i];
    if (SPECIAL_TOKEN_NAME_MATCHERS.some(matcher => tokenName.includes(matcher))) {
      modes[i] = ISOLATION_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
        ? TokenMode.ISOLATION
        : SILO_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
        ? TokenMode.SILO
        : TokenMode.NORMAL;
      const tokenAddress = tokenAddresses[i];
      const isolationModeTokenContract = dolomiteContractFactory.isolationModeToken({
        address: tokenAddress,
        network: network,
      });
      if (tokenName.includes('Fee + Staked GLP')) {
        tokenAddresses[i] = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
      } else {
        tokenAddresses[i] = (await isolationModeTokenContract.UNDERLYING_TOKEN()).toLowerCase();
      }
    } else {
      modes.push(TokenMode.NORMAL);
    }
  }

  const tokens: DolomiteTokenDefinition[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    tokens.push({
      address: tokenAddresses[i],
      network: network,
      metaType: isPositive ? MetaType.SUPPLIED : MetaType.BORROWED,
      name: tokenNames[i],
      mode: modes[i],
      wrappedTokenAddress: wrappedTokenAddresses[i],
    });
  }

  return tokens;
}

export async function mapTokensToDolomiteDataProps(
  params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps>,
  dolomiteContractFactory: DolomiteContractFactory,
  network: Network,
  isPositive: boolean,
): Promise<DolomiteDataProps> {
  const dolomiteTokens = await getTokenDefinitionsLib(params, dolomiteContractFactory, network, isPositive);
  return dolomiteTokens.reduce<DolomiteDataProps>((memo, token, i) => {
    memo[token.address.toLowerCase()] = {
      wrappedTokenAddress: token.wrappedTokenAddress,
      name: token.name,
      mode: token.mode,
      marketId: i,
    };
    return memo;
  }, {});
}

export async function getTokenBalancesPerPositionLib(
  params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>,
  dolomiteContractFactory: DolomiteContractFactory,
  network: Network,
  isPositive: boolean,
): Promise<BigNumberish[]> {
  const tokenAddressToAmount = new Map<string, BigNumberish>();
  for (let i = 0; i < 100; i += 1) {
    const [, tokenAddresses, , weiAmounts] = await params.contract.getAccountBalances({
      owner: params.address,
      number: i,
    });
    tokenAddresses.forEach((tokenAddress, i) => {
      let amount = BigNumber.from(weiAmounts[i].value);
      if (!weiAmounts[i].sign) {
        amount = amount.mul(-1);
      }
      if (amount.gte(0) && isPositive) {
        tokenAddressToAmount.set(tokenAddress.toLowerCase(), amount);
      } else if (amount.lt(0) && !isPositive) {
        // make the number positive again
        tokenAddressToAmount.set(tokenAddress.toLowerCase(), amount.mul(-1));
      }
    });
    if (tokenAddresses.length === 0) {
      break;
    }
  }

  if (isPositive) {
    // debt balances can't be isolated or siloed
    for (let i = 0; i < params.contractPosition.tokens.length; i++) {
      const tokenAddress = params.contractPosition.tokens[i].address;
      const props = params.contractPosition.dataProps[tokenAddress];
      if (props.mode === TokenMode.ISOLATION) {
        const isolationModeTokenContract = dolomiteContractFactory.isolationModeToken({
          address: props.wrappedTokenAddress,
          network,
        });
        const vaultAddress = await isolationModeTokenContract.getVaultByAccount(params.address);
        const balanceWei = await params.contract.getAccountWei({ owner: vaultAddress, number: 0 }, props.marketId);
        if (balanceWei.value.gt(0)) {
          tokenAddressToAmount.set(tokenAddress, balanceWei.value);
        }
      } else if (props.mode === TokenMode.SILO) {
        // TODO: implement silo mode
      }
    }
  }

  return params.contractPosition.tokens.map(token => tokenAddressToAmount.get(token.address) || 0);
}
