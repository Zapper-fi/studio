import { Inject, NotImplementedException } from '@nestjs/common';
import { range, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDefinitionsParams } from '~position/template/app-token.template.types';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { CamelotViemContractFactory } from '../contracts';
import { CamelotNitroPool } from '../contracts/viem';

type CamelotNitroContractPositionDefinition = {
  address: string;
  stakingTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class ArbitrumCamelotNitroContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<CamelotNitroPool> {
  groupLabel = 'Nitro';

  nitroPoolFactoryContractAddress = '0xe0a6b372ac6af4b37c7f3a989fe5d5b194c24569';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotViemContractFactory) protected readonly contractFactory: CamelotViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CamelotNitroContractPositionDefinition[]> {
    const nitroPoolFactoryContract = this.contractFactory.camelotNitroFactory({
      address: this.nitroPoolFactoryContractAddress,
      network: this.network,
    });
    const poolLength = await multicall.wrap(nitroPoolFactoryContract).read.publishedNitroPoolsLength();

    const poolAddresses = await Promise.all(
      range(0, Number(poolLength)).map(async i => {
        const poolAddressRaw = await multicall.wrap(nitroPoolFactoryContract).read.getPublishedNitroPool([BigInt(i)]);
        return poolAddressRaw.toLowerCase();
      }),
    );

    const nitroDefinitions = await Promise.all(
      poolAddresses.map(async address => {
        const nitroContract = this.contractFactory.camelotNitroPool({ address, network: this.network });
        const [nftPoolAddress, rewardToken1, rewardToken2, grailTokenAddress] = await Promise.all([
          await multicall.wrap(nitroContract).read.nftPool(),
          await multicall.wrap(nitroContract).read.rewardsToken1(),
          await multicall.wrap(nitroContract).read.rewardsToken2(),
          await multicall.wrap(nitroContract).read.grailToken(),
        ]);

        const nftPoolContract = this.contractFactory.camelotNftPool({ address: nftPoolAddress, network: this.network });
        const [lpToken] = await multicall.wrap(nftPoolContract).read.getPoolInfo();

        return {
          address,
          stakingTokenAddress: lpToken.toLowerCase(),
          rewardTokenAddresses: [
            rewardToken1[0].toLowerCase(),
            rewardToken2[0].toLowerCase(),
            grailTokenAddress.toLowerCase(),
          ],
        };
      }),
    );

    return nitroDefinitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<CamelotNitroPool, CamelotNitroContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.stakingTokenAddress,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  getContract(address: string) {
    return this.contractFactory.camelotNitroPool({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CamelotNitroPool>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const nitroContract = this.contractFactory.camelotNitroPool({
          address: contractPosition.address,
          network: this.network,
        });
        const [numPositionsRaw, nftPoolAddress, [totalDepositAmount], [pending1, pending2]] = await Promise.all([
          multicall.wrap(nitroContract).read.userTokenIdsLength([address]),
          multicall.wrap(nitroContract).read.nftPool(),
          multicall.wrap(nitroContract).read.userInfo([address]),
          multicall.wrap(nitroContract).read.pendingRewards([address]),
        ]);

        const nftPoolContract = this.contractFactory.camelotNftPool({ address: nftPoolAddress, network: this.network });

        const grailRewardsRaw = await Promise.all(
          range(0, Number(numPositionsRaw)).map(async i => {
            const tokenId = await multicall.wrap(nitroContract).read.userTokenId([address, BigInt(i)]);

            return await multicall.wrap(nftPoolContract).read.pendingRewards([tokenId]);
          }),
        );
        const grailRewards = sum(grailRewardsRaw.map(x => Number(x)));

        const suppliedtAmount = drillBalance(contractPosition.tokens[0], totalDepositAmount.toString());
        const rewardsTokenBalances = [
          drillBalance(contractPosition.tokens[1], pending1.toString()),
          drillBalance(contractPosition.tokens[2], pending2.toString()),
          drillBalance(contractPosition.tokens[3], grailRewards.toString()),
        ];

        return {
          ...contractPosition,
          tokens: [suppliedtAmount, ...rewardsTokenBalances],
          balanceUSD: suppliedtAmount.balanceUSD + sum(rewardsTokenBalances.map(x => x.balanceUSD)),
        };
      }),
    );

    return balances;
  }
}
