import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { getTokenDefinitionsLib } from '~apps/dolomite/utils';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { DolomiteContractFactory, DolomiteMargin } from '../contracts';

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
    return getTokenDefinitionsLib(params, this.dolomiteContractFactory, this.network, true);
  }

  async getLabel(
    params: GetDisplayPropsParams<DolomiteMargin, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return Promise.resolve(getLabelFromToken(params.contractPosition.tokens[0]));
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<DolomiteMargin, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const tokenAddressToAmount = new Map<string, BigNumberish | undefined>();
    for (let i = 0; i < params.contractPosition.tokens.length; i += 1) {
      const [, tokenAddresses, , weiAmounts] = await params.contract.getAccountBalances({
        owner: params.address,
        number: i,
      });
      tokenAddresses.forEach((tokenAddress, i) => {
        const amount = BigNumber.from(weiAmounts[i].value);
        tokenAddressToAmount.set(tokenAddress, weiAmounts[i].sign ? amount : amount.eq(0) ? 0 : undefined);
      });
      if (tokenAddresses.length === 0) {
        break;
      }
    }

    return params.contractPosition.tokens.map(token => tokenAddressToAmount.get(token.address) || 0);
  }
}
