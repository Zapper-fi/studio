import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ArgoFinanceContractFactory, XArgoPledging } from '../contracts';

export abstract class ArgoFinancePledgingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<XArgoPledging> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArgoFinanceContractFactory) private readonly contractFactory: ArgoFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): XArgoPledging {
    return this.contractFactory.xArgoPledging({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `xARGO Pledging`;
  }

  async getDataProps({ contractPosition, multicall }: GetDataPropsParams<XArgoPledging>) {
    const xArgoToken = contractPosition.tokens[0];
    const xArgoContract = multicall.wrap(
      this.contractFactory.xArgo({ address: xArgoToken.address, network: this.network }),
    );

    const [supplyRaw, decimals] = await Promise.all([xArgoContract.totalSupply(), xArgoContract.decimals()]);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = 1; // Note: Consult liquidity pools for peg once set up
    const price = xArgoToken.price * pricePerShare;
    const liquidity = supply * price;

    return { liquidity };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<XArgoPledging, DefaultDataProps>): Promise<BigNumberish[]> {
    const rewardToken1 = contractPosition.tokens[1];
    const rewardToken2 = contractPosition.tokens[2];

    const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
      contract._balances(address),
      contract.claimableRewards(address),
    ]);

    const xArgoRewardBalance = rewardBalanceRaw.find(x => x.token.toLowerCase() === rewardToken1.address)?.amount ?? 0;
    const wCroRewardBalance = rewardBalanceRaw.find(x => x.token.toLowerCase() === rewardToken2.address)?.amount ?? 0;

    return [stakedBalanceRaw, xArgoRewardBalance, wCroRewardBalance];
  }
}
