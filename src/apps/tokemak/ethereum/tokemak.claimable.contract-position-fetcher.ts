import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { TokemakClaimableResolver } from '../common/tokemak.claimable.resolver';
import { TokemakViemContractFactory } from '../contracts';
import { TokemakRewards } from '../contracts/viem';

@PositionTemplate()
export class EthereumTokemakClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TokemakRewards> {
  groupLabel = 'Claimable';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TokemakViemContractFactory) private readonly contractFactory: TokemakViemContractFactory,
    @Inject(TokemakClaimableResolver) private readonly claimableResolver: TokemakClaimableResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x79dd22579112d8a5f7347c5ed7e609e60da713c5' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x2e9d63788249371f1dfc918a52f8d799f4a38c94',
        network: this.network,
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.tokemakRewards({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TokemakRewards>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<TokemakRewards>): Promise<BigNumberish[]> {
    const payload = await this.claimableResolver.getClaimableBalanceData(address);
    if (!payload) return [];

    const { chainId, cycle, wallet, amount } = payload;

    const claimableBalanceRaw = await contract.read
      .getClaimableAmount([{ chainId: BigInt(chainId), cycle: BigInt(cycle), wallet, amount: BigInt(amount) }])
      .catch(() => 0);

    return [claimableBalanceRaw];
  }
}
