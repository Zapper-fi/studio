import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { ArgoFinanceContractFactory, XArgoPledging } from '../contracts';

@PositionTemplate()
export class CronosArgoFinancePledgingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<XArgoPledging> {
  groupLabel = 'Pledging';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArgoFinanceContractFactory) private readonly contractFactory: ArgoFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x1de93ce995d1bc763c2422ba30b1e73de4a45a01' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552' }, // xARGO
      { metaType: MetaType.CLAIMABLE, address: '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552' }, // xARGO
      { metaType: MetaType.CLAIMABLE, address: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23' }, // wCRO
    ];
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
  }: GetTokenBalancesParams<XArgoPledging>): Promise<BigNumberish[]> {
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
