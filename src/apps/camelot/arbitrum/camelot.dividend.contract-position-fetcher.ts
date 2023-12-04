import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { GetDefinitionsParams } from '~position/template/app-token.template.types';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { CamelotViemContractFactory } from '../contracts';
import { CamelotDividend } from '../contracts/viem';

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
    @Inject(CamelotViemContractFactory) protected readonly contractFactory: CamelotViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.camelotDividend({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CamelotDividendDefinition[]> {
    const dividenContract = this.contractFactory.camelotDividend({
      address: this.dividendContractAddress,
      network: this.network,
    });

    const numRewardToken = await multicall.wrap(dividenContract).read.distributedTokensLength();

    const rewardTokenAddresses = await Promise.all(
      range(0, Number(numRewardToken)).map(async index => {
        const rewardTokenAddressRaw = await multicall.wrap(dividenContract).read.distributedToken([BigInt(index)]);
        return rewardTokenAddressRaw.toLowerCase();
      }),
    );

    const suppliedTokenAddress = await multicall.wrap(dividenContract).read.xGrailToken();

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

  async getLabel({ contractPosition }: GetDisplayPropsParams<CamelotDividend>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<CamelotDividend>) {
    const allocation = await contract.read.usersAllocation([address]);
    const claimableTokens = contractPosition.tokens.filter(isClaimable);

    const claimableBalances = await Promise.all(
      claimableTokens.map(token => {
        return contract.read.pendingDividendsAmount([token.address, address]);
      }),
    );

    return [allocation, ...claimableBalances];
  }
}
