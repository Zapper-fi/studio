import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { GetDefinitionsParams } from '~position/template/app-token.template.types';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { CamelotContractFactory, CamelotDividend } from '../contracts';

export type CamelotDividendDefinition = {
  address: string;
  suppliedTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class ArbitrumCamelotDividendContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  CamelotDividend,
  DefaultDataProps,
  CamelotDividendDefinition
> {
  groupLabel = 'Dividend';

  dividendContractAddress = '0x5422aa06a38fd9875fc2501380b40659feebd3bb';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotContractFactory) protected readonly contractFactory: CamelotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CamelotDividend {
    return this.contractFactory.camelotDividend({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CamelotDividendDefinition[]> {
    const dividenContract = this.contractFactory.camelotDividend({
      address: this.dividendContractAddress,
      network: this.network,
    });

    const numRewardToken = await multicall.wrap(dividenContract).distributedTokensLength();

    const rewardTokenAddresses = await Promise.all(
      range(0, numRewardToken.toNumber()).map(async index => {
        const rewardTokenAddressRaw = await multicall.wrap(dividenContract).distributedToken(index);
        return rewardTokenAddressRaw.toLowerCase();
      }),
    );

    const suppliedTokenAddress = await multicall.wrap(dividenContract).xGrailToken();

    return [{ address: this.dividendContractAddress, suppliedTokenAddress, rewardTokenAddresses }];
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<CamelotDividend, CamelotDividendDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.suppliedTokenAddress,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel() {
    return `Dividends`;
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<CamelotDividend>) {
    const allocation = await contract.usersAllocation(address);
    const claimableTokens = contractPosition.tokens.filter(isClaimable);

    const claimableBalances = await Promise.all(
      claimableTokens.map(token => {
        return contract.pendingDividendsAmount(token.address, address);
      }),
    );

    return [allocation, ...claimableBalances];
  }
}
