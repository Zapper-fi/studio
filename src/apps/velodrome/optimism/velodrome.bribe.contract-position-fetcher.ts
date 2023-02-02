import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VelodromeDefinitionsResolver } from '../common/velodrome.definitions-resolver';
import { VelodromeContractFactory, VelodromeBribe } from '../contracts';

export type VelodromeBribeDefinition = {
  address: string;
  name: string;
};

@PositionTemplate()
export class OptimismVelodromeBribeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VelodromeBribe> {
  groupLabel = 'Bribe';

  veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
    @Inject(VelodromeDefinitionsResolver) protected readonly definitionsResolver: VelodromeDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VelodromeBribe {
    return this.contractFactory.velodromeBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<VelodromeBribeDefinition[]> {
    return this.definitionsResolver.getBribeDefinitions();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeBribe>) {
    const numRewards = Number(await contract.rewardsListLength());
    const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
    const tokenDefinitions = bribeTokens.map(token => {
      const tokenFound = baseTokens.find(p => p.address === token.toLowerCase());
      if (!tokenFound) return null;
      return {
        metaType: MetaType.CLAIMABLE,
        address: token,
        network: this.network,
      };
    });

    return _.compact(tokenDefinitions);
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<VelodromeBribe, DefaultDataProps, VelodromeBribeDefinition>): Promise<string> {
    return `${definition.name} Bribe`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const escrow = multicall.wrap(
      this.contractFactory.velodromeVe({ address: this.veTokenAddress, network: this.network }),
    );
    const veCount = Number(await escrow.balanceOf(address));
    if (veCount === 0) {
      return [];
    }

    const veTokenIds = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
        return tokenId;
      }),
    );

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeTokens = contractPosition.tokens;
        const bribeContract = multicall.wrap(this.getContract(contractPosition.address));

        const tokenBalancesRaw = await Promise.all(
          bribeTokens.map(async bribeToken => {
            const tokenBalancePerBribe = await Promise.all(
              veTokenIds.map(async veTokenId => {
                const balance = await multicall.wrap(bribeContract).earned(bribeToken.address, veTokenId);
                return Number(balance);
              }),
            );
            return tokenBalancePerBribe;
          }),
        );

        const tokenBalances = tokenBalancesRaw.flat();

        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, tokenBalances[idx]?.toString() ?? '0'),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };

        return balance;
      }),
    );

    return _.compact(balances);
  }
}
