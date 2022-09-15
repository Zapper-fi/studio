import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { StargateAa, StargateContractFactory } from '../contracts';

type StargateAuctionLockedAppTokenDataProps = {
  liquidity: number;
  reserve: number;
};

@PositionTemplate()
export class EthereumStargateAuctionLockedTokenFetcher extends AppTokenTemplatePositionFetcher<
  StargateAa,
  StargateAuctionLockedAppTokenDataProps
> {
  groupLabel = 'Auction Locked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateAa {
    return this.contractFactory.stargateAa({ address, network: this.network });
  }

  getAddresses() {
    return ['0x4dfcad285ef39fed84e77edf1b7dbc442565e55e'];
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<StargateAa>) {
    return contract.stargateToken();
  }

  async getPricePerShare(): Promise<number | number[]> {
    return 4; // 1 aaSTG = 4 STG
  }

  async getDataProps({ appToken }: GetDataPropsParams<StargateAa, StargateAuctionLockedAppTokenDataProps>) {
    const reserve = appToken.supply; // 1:1
    const liquidity = appToken.supply * appToken.price;
    return { reserve, liquidity };
  }
}
