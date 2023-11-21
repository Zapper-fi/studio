import { Inject, NotImplementedException } from '@nestjs/common';
import { BigNumber } from 'ethers/lib/ethers';
import _, { range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { VelodromeDefinitionsResolver } from '../common/velodrome.definitions-resolver';
import { VelodromeViemContractFactory } from '../contracts';
import { VelodromeBribe } from '../contracts/viem';

@PositionTemplate()
export class OptimismVelodromeBribeContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<VelodromeBribe> {
  groupLabel = 'Bribe';

  veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeViemContractFactory) protected readonly contractFactory: VelodromeViemContractFactory,
    @Inject(VelodromeDefinitionsResolver) protected readonly definitionsResolver: VelodromeDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.velodromeBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const bribeAddresses = await this.definitionsResolver.getBribeAddresses();

    return bribeAddresses.map(address => {
      return {
        address,
      };
    });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeBribe>) {
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

  async getLabel({ contractPosition }: GetDisplayPropsParams<VelodromeBribe>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    // Get ve token IDs
    const escrow = this.contractFactory.velodromeVe({ address: this.veTokenAddress, network: this.network });
    const mcEscrow = multicall.wrap(escrow);
    const veCount = Number(await mcEscrow.read.balanceOf([address]));
    const veTokenIds = await Promise.all(
      range(veCount).map(async i => mcEscrow.read.tokenOfOwnerByIndex([address, BigInt(i)])),
    );
    if (veTokenIds.length === 0) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeContract = multicall.wrap(this.getContract(contractPosition.address));

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
    const escrow = this.contractFactory.velodromeVe({ address: this.veTokenAddress, network: this.network });
    const mcEscrow = multicall.wrap(escrow);
    const veCount = Number(await mcEscrow.read.balanceOf([address]));
    const veTokenIds = await Promise.all(
      range(veCount).map(async i => mcEscrow.read.tokenOfOwnerByIndex([address, BigInt(i)])),
    );
    if (veTokenIds.length === 0) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeContract = multicall.wrap(this.getContract(contractPosition.address));

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
