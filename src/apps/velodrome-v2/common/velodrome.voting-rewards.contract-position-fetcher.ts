import { Inject, NotImplementedException } from '@nestjs/common';
import { BigNumber } from 'ethers/lib/ethers';
import _, { range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { VelodromeV2ViemContractFactory } from '../contracts';
import { VelodromeV2Bribe } from '../contracts/viem';

import { VelodromeV2AddressesResolver } from './velodrome-v2.addresses-resolver';

export abstract class VotingRewardsContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<VelodromeV2Bribe> {
  veTokenAddress = '0xfaf8fd17d9840595845582fcb047df13f006787d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ViemContractFactory) protected readonly contractFactory: VelodromeV2ViemContractFactory,
    @Inject(VelodromeV2AddressesResolver) protected readonly definitionsResolver: VelodromeV2AddressesResolver,
  ) {
    super(appToolkit);
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeV2Bribe>) {
    const numRewards = Number(await contract.read.rewardsListLength());
    const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.read.rewards([BigInt(n)])));
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

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    // Get ve token IDs
    const escrow = this.contractFactory.velodromeV2Ve({ address: this.veTokenAddress, network: this.network });
    const mcEscrow = multicall.wrap(escrow);
    const veCount = Number(await mcEscrow.read.balanceOf([address]));
    const veTokenIds = await Promise.all(
      range(veCount).map(async i => mcEscrow.read.ownerToNFTokenIdList([address, BigInt(i)])),
    );
    if (veTokenIds.length === 0) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeContract = this.contractFactory.velodromeV2Bribe({
          address: contractPosition.address,
          network: this.network,
        });

        const tokens = await Promise.all(
          contractPosition.tokens.map(async bribeToken => {
            const balancesPerBribePromises = veTokenIds.map(async id =>
              bribeContract.read.earned([bribeToken.address, id]),
            );
            const balancesPerBribe = await Promise.all(balancesPerBribePromises);
            const balancesPerBribeSum = balancesPerBribe.reduce((acc, v) => acc.add(v), BigNumber.from(0));
            return drillBalance(bribeToken, balancesPerBribeSum.toString());
          }),
        );

        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }

  async getRawBalances(address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    // Get ve token IDs
    const escrow = this.contractFactory.velodromeV2Ve({ address: this.veTokenAddress, network: this.network });
    const mcEscrow = multicall.wrap(escrow);
    const veCount = Number(await mcEscrow.read.balanceOf([address]));
    const veTokenIds = await Promise.all(
      range(veCount).map(async i => mcEscrow.read.ownerToNFTokenIdList([address, BigInt(i)])),
    );
    if (veTokenIds.length === 0) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeContract = this.contractFactory.velodromeV2Bribe({
          address: contractPosition.address,
          network: this.network,
        });

        const balance: RawContractPositionBalance = {
          key: this.appToolkit.getPositionKey(contractPosition),
          tokens: await Promise.all(
            contractPosition.tokens.map(async bribeToken => {
              const balancesPerBribePromises = veTokenIds.map(async id =>
                bribeContract.read.earned([bribeToken.address, id]),
              );
              const balancesPerBribe = await Promise.all(balancesPerBribePromises);
              const balancesPerBribeSum = balancesPerBribe.reduce((acc, v) => acc.add(v), BigNumber.from(0));
              return { key: this.appToolkit.getPositionKey(bribeToken), balance: balancesPerBribeSum.toString() };
            }),
          ),
        };

        return balance;
      }),
    );

    return balances;
  }
}
