import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _, { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { SentimentAccountsResolver } from '../common/sentiment.accounts-resolver';
import { SentimentContractFactory, SentimentLToken } from '../contracts';

export type SentimentSupplyAppTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumSentimentBorrowContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  SentimentLToken,
  DefaultDataProps,
  SentimentSupplyAppTokenDefinition
> {
  groupLabel = 'Borrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) private readonly contractFactory: SentimentContractFactory,
    @Inject(SentimentAccountsResolver) private readonly accountResolver: SentimentAccountsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SentimentLToken {
    return this.contractFactory.sentimentLToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<SentimentSupplyAppTokenDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['supply'],
    });

    return appTokens.map(x => ({ address: x.address, underlyingTokenAddress: x.tokens[0].address }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SentimentLToken, SentimentSupplyAppTokenDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SentimentLToken>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const positionBalances = await Promise.all(
      contractPositions.map(async position => {
        const supplyTokenContract = this.contractFactory.sentimentLToken({
          address: position.address,
          network: this.network,
        });

        const [accountAddresses, underlyingTokenAddress] = await Promise.all([
          this.accountResolver.getAccountsOfOwner(address),
          multicall.wrap(supplyTokenContract).asset(),
        ]);

        const borrowRaw = await Promise.all(
          accountAddresses.map(address => multicall.wrap(supplyTokenContract).getBorrowBalance(address)),
        );
        const supplyRaw = await Promise.all(
          accountAddresses.map(address =>
            multicall
              .wrap(this.contractFactory.erc20({ address: underlyingTokenAddress, network: this.network }))
              .balanceOf(address),
          ),
        );
        const depositedAmountRaw = _.sum(supplyRaw);
        const borrowedAmountRaw = _.sum(borrowRaw);

        const depositedBalance = drillBalance(position.tokens[0], depositedAmountRaw.toString());
        const borrowedBalance = drillBalance(position.tokens[1], borrowedAmountRaw.toString());

        return {
          ...position,
          tokens: [depositedBalance, borrowedBalance],
          balanceUSD: depositedBalance.balanceUSD - borrowedBalance.balanceUSD,
        };
      }),
    );

    return compact(positionBalances);
  }
}
