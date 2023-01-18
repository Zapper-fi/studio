import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { RocketNodeDeposit, RocketPoolContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumRocketPoolMinipoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RocketNodeDeposit> {
  groupLabel = 'Minipools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) protected readonly contractFactory: RocketPoolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RocketNodeDeposit {
    return this.contractFactory.rocketNodeDeposit({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: ZERO_ADDRESS,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RocketNodeDeposit>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, multicall }: GetTokenBalancesParams<RocketNodeDeposit>) {
    const miniPoolManagerAddress = '0x6293b8abc1f36afb22406be5f96d893072a8cf3a';
    const miniPoolManager = this.contractFactory.rocketMinipoolManager({
      address: miniPoolManagerAddress,
      network: this.network,
    });

    const minipoolCountRaw = await multicall.wrap(miniPoolManager).getNodeActiveMinipoolCount(address);
    const minipoolDepositSize = 16 * 10 ** 18; // 16 ETH
    const balanceRaw = Number(minipoolCountRaw) * minipoolDepositSize;
    return [balanceRaw.toString()];
  }
}
