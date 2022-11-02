import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { AirswapContractFactory, StakingV2 } from '../contracts';

@PositionTemplate()
export class EthereumAirswapSAstV3TokenFetcher extends AppTokenTemplatePositionFetcher<StakingV2> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AirswapContractFactory) private readonly contractFactory: AirswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakingV2 {
    return this.contractFactory.stakingV2({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x6d88b09805b90dad911e5c5a512eedd984d6860b'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<StakingV2>) {
    return contract.token();
  }

  async getLabel(): Promise<string> {
    return 'sAST v3';
  }

  async getReserves({ appToken }: GetDataPropsParams<StakingV2>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<StakingV2>) {
    return appToken.price * appToken.supply;
  }

  getApy(_params: GetDataPropsParams<StakingV2>) {
    return 0;
  }
}
