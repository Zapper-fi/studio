import { Inject, NotImplementedException } from '@nestjs/common';
import { range } from 'lodash';

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

import { CamelotContractFactory, CamelotNftPool } from '../contracts';

type CamelotFarmContractPositionDefinition = {
  address: string;
  stakingTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class ArbitrumCamelotFarmContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<CamelotNftPool> {
  groupLabel = 'Farm';

  masterContractAddress = '0x55401a4f396b3655f66bf6948a1a4dc61dfc21f4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotContractFactory) protected readonly contractFactory: CamelotContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CamelotFarmContractPositionDefinition[]> {
    const masterContract = this.contractFactory.camelotMaster({
      address: this.masterContractAddress,
      network: this.network,
    });
    const poolLength = await multicall.wrap(masterContract).poolsLength();

    const poolAddresses = await Promise.all(
      range(0, Number(poolLength)).map(async i => {
        const poolAddressRaw = await multicall.wrap(masterContract).getPoolAddressByIndex(i);
        return poolAddressRaw.toLowerCase();
      }),
    );

    const farmDefinitions = await Promise.all(
      poolAddresses.map(async address => {
        const nftPoolContract = this.contractFactory.camelotNftPool({ address, network: this.network });
        const poolInfo = await multicall.wrap(nftPoolContract).getPoolInfo();
        const { lpToken, grailToken, xGrailToken } = poolInfo;

        return {
          address,
          stakingTokenAddress: lpToken.toLowerCase(),
          rewardTokenAddresses: [grailToken.toLowerCase(), xGrailToken.toLowerCase()],
        };
      }),
    );

    return farmDefinitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<CamelotNftPool, CamelotFarmContractPositionDefinition>) {
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

  getContract(address: string): CamelotNftPool {
    return this.contractFactory.camelotNftPool({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CamelotNftPool>) {
    return `${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const nftPoolContract = this.contractFactory.camelotNftPool({
          address: contractPosition.address,
          network: this.network,
        });
        const [numPositionsRaw, xGrailRewardsShareRaw] = await Promise.all([
          multicall.wrap(nftPoolContract).balanceOf(address),
          multicall.wrap(nftPoolContract).xGrailRewardsShare(),
        ]);

        return await Promise.all(
          range(0, Number(numPositionsRaw)).map(async i => {
            const tokenId = await multicall.wrap(nftPoolContract).tokenOfOwnerByIndex(address, i);
            const [stakingPosition, rewardAmountsCombined] = await Promise.all([
              multicall.wrap(nftPoolContract).getStakingPosition(tokenId),
              multicall.wrap(nftPoolContract).pendingRewards(tokenId),
            ]);
            const xGrailRewardsShare = Number(xGrailRewardsShareRaw) / 10 ** 4;

            const xGrailBalance = Number(rewardAmountsCombined) * xGrailRewardsShare;
            const grailBalance = Number(rewardAmountsCombined) - xGrailBalance;

            const suppliedtAmount = drillBalance(contractPosition.tokens[0], stakingPosition.amount.toString());
            const grailAmount = drillBalance(contractPosition.tokens[1], grailBalance.toString());
            const xGrailAmount = drillBalance(contractPosition.tokens[2], xGrailBalance.toString());

            return {
              ...contractPosition,
              tokens: [suppliedtAmount, grailAmount, xGrailAmount],
              balanceUSD: suppliedtAmount.balanceUSD + grailAmount.balanceUSD + xGrailAmount.balanceUSD,
            };
          }),
        );
      }),
    );

    return balances.flat();
  }
}
