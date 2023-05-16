import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';
import { unix } from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { ConcaveContractFactory, Lsdcnv } from '../contracts';

export type ConcaveStakingV1Lock = {
  deposit: string;
  maturity: number;
  poolBalance: string;
  poolID: number;
  poolTerm: number;
  positionID: number;
  rewardDebt: string;
  to: string;
};

export type ConcaveStakingV1LockData = {
  logStakingV1_Lock: ConcaveStakingV1Lock[];
};

export const GET_STAKING_V1_LOCK_EVENTS = gql`
  query GetStakingV1Locks($address: String!) {
    logStakingV1_Lock(where: { to: { _eq: $address } }) {
      deposit
      maturity
      poolBalance
      poolID
      poolTerm
      positionID
      rewardDebt
      to
    }
  }
`;

export type ConcaveLsdcnvContractPositionDataProps = {
  poolID: number;
  unlockTime: number;
  tokenId: number;
};

@PositionTemplate()
export class EthereumConcaveLiquidStakingContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<Lsdcnv> {
  groupLabel = 'Liquid Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcaveContractFactory) protected readonly concaveContractFactory: ConcaveContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Lsdcnv {
    return this.concaveContractFactory.lsdcnv({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x93c3a816242e50ea8871a29bf62cc3df58787fbd' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<Lsdcnv>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x000000007a58f5f58e697e51ab0357bc9e260a04',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x000000007a58f5f58e697e51ab0357bc9e260a04',
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return 'Liquid Staked CNV';
  }

  getTokenBalancesPerPosition(_params: GetTokenBalancesParams<Lsdcnv, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<ConcaveLsdcnvContractPositionDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const [lsdCnv] = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const contract = multicall.wrap(this.getContract(lsdCnv.address));
    const balanceRaw = await contract.balanceOf(address);
    if (Number(balanceRaw) === 0) return [];

    const lockData = await gqlFetch<ConcaveStakingV1LockData>({
      endpoint: 'https://concave.hasura.app/v1/graphql',
      query: GET_STAKING_V1_LOCK_EVENTS,
      variables: { address: getAddress(address) },
    });

    const positions = await Promise.all(
      lockData.logStakingV1_Lock.map(async event => {
        const positionId = event.positionID;
        const unlockDate = unix(event.maturity).format('LL');
        const label = `Liquid Staking (#${positionId}) - Unlock: ${unlockDate}`;

        const [positionInfo, positionRewardInfo] = await Promise.all([
          multicall.wrap(contract).positions(positionId),
          multicall.wrap(contract).viewPositionRewards(positionId),
        ]);

        const stakedToken = lsdCnv.tokens.find(isSupplied)!;
        const rewardToken = lsdCnv.tokens.find(isClaimable)!;
        const stakedTokenBalance = drillBalance(stakedToken, positionInfo.deposit.toString());
        const rewardBalanceRaw = positionRewardInfo.totalRewards.sub(positionRewardInfo.amountDeposited).toString();
        const rewardTokenBalance = drillBalance(rewardToken, rewardBalanceRaw);
        const tokens = [stakedTokenBalance, rewardTokenBalance];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);

        const position: ContractPositionBalance<ConcaveLsdcnvContractPositionDataProps> = {
          ...lsdCnv,
          tokens,
          balanceUSD,
          dataProps: {
            poolID: event.poolID,
            tokenId: event.positionID,
            unlockTime: event.maturity,
          },
          displayProps: {
            label,
            images: lsdCnv.displayProps.images,
          },
        };

        return position;
      }),
    );

    return positions;
  }
}
