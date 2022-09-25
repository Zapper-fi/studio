import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BendDaoContractFactory } from '../contracts';
import { BendDaoBToken } from '../contracts/ethers/BendDaoBToken';

@PositionTemplate()
export class EthereumBendDaoSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<BendDaoBToken> {
  groupLabel = 'Lending';
  bTokenAddress = '0xed1840223484483c0cb050e6fc344d1ebf0778a9';
  wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  dataProviderAddress = '0x0b54cdf07d5467012a2d5731c5f87f9c6945bea9';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BendDaoContractFactory) protected readonly contractFactory: BendDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BendDaoBToken {
    return this.contractFactory.bendDaoBToken({ network: this.network, address });
  }

  getAddresses(): string[] | Promise<string[]> {
    return [this.bTokenAddress];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BendDaoBToken>) {
    return contract.UNDERLYING_ASSET_ADDRESS();
  }

  async getLiquidity({ appToken }: GetDataPropsParams<BendDaoBToken>): Promise<number> {
    return appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<BendDaoBToken>): Promise<number[]> {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ multicall }: GetDataPropsParams<BendDaoBToken>): Promise<number> {
    const pool = multicall.wrap(
      this.contractFactory.bendDaoProtocolDataProvider({
        network: this.network,
        address: this.dataProviderAddress,
      }),
    );

    const reservesData = await pool.getReserveData(this.wethAddress);

    return (Number(reservesData.liquidityRate) / 10 ** 27) * 100;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BendDaoBToken>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<BendDaoBToken>): Promise<string> {
    return appToken.symbol;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<BendDaoBToken>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR`;
  }
}
