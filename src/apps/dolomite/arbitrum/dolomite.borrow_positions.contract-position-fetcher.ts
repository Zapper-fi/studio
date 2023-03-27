import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Multicall } from '~contract/contracts';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { DolomiteContractFactory, DolomiteMargin } from '../contracts';

const CHUNK_SIZE = 32;

@PositionTemplate()
export class ArbitrumDolomiteBorrowPositionsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<DolomiteMargin> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) protected readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DolomiteMargin {
    return this.dolomiteContractFactory.dolomiteMargin({ address, network: this.network });
  }

  getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return Promise.resolve([
      {
        address: '0x6bd780e7fdf01d77e4d475c821f1e7ae05409072'.toLowerCase(),
      },
    ]);
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<DolomiteMargin, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const tokenCount = (await params.contract.getNumMarkets()).toNumber();

    const callChunks = this.chunkArrayForMultiCall(
      Array.from({ length: tokenCount }, (_, i) => i),
      (_, i) => ({
        target: params.address,
        callData: params.contract.interface.encodeFunctionData('getMarketTokenAddress', [i]),
      }),
    );

    let tokenAddresses: string[] = [];
    for (let i = 0; i < callChunks.length; i++) {
      const { returnData } = await params.multicall.contract.callStatic.aggregate(callChunks[i], false);
      const rawTokens = returnData.map(({ data }): string => {
        return ethers.utils.defaultAbiCoder.decode(['address'], data)[0] as string;
      });
      tokenAddresses = tokenAddresses.concat(...rawTokens);
    }

    const tokens: UnderlyingTokenDefinition[] = [];
    for (let i = 0; i < tokenCount; i++) {
      tokens.push({
        address: tokenAddresses[i],
        network: this.network,
        metaType: MetaType.SUPPLIED,
      });
    }

    return tokens;
  }

  async getLabel(
    params: GetDisplayPropsParams<DolomiteMargin, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    // TODO: replace
    return `Staked ${getLabelFromToken(params.contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<DolomiteMargin, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const tokenAddressToAmount = new Map<string, BigNumberish>();
    for (let i = 0; i < params.contractPosition.tokens.length; i += CHUNK_SIZE) {
      const [, tokenAddresses, , weiAmounts] = await params.contract.getAccountBalances({
        owner: params.address,
        number: i / CHUNK_SIZE,
      });
      tokenAddresses.forEach((tokenAddress, i) => {
        const amount = BigNumber.from(weiAmounts[i].value);
        tokenAddressToAmount.set(tokenAddress, weiAmounts[i].sign ? amount : amount.mul(-1));
      });
      if (tokenAddresses.length === 0) {
        break;
      }
    }

    return params.contractPosition.tokens.map(token => tokenAddressToAmount.get(token.address) || 0);
  }

  private chunkArrayForMultiCall<T>(
    values: T[],
    getCallData: (value: T, index: number) => { target: string; callData: string },
  ): Multicall.CallStruct[][] {
    const callChunks: Multicall.CallStruct[][] = [];
    let index = 0;
    for (let i = 0; i < values.length; i += CHUNK_SIZE) {
      callChunks[i] = [];
      for (let j = 0; j < CHUNK_SIZE && index < values.length; j++) {
        callChunks[i / CHUNK_SIZE].push(getCallData(values[i + j], i + j));
        index += 1;
      }
    }
    return callChunks;
  }
}
