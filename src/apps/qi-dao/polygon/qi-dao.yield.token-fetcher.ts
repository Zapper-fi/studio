import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory, QiDaoYieldToken } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class PolygonQiDaoYieldTokenFetcher extends AppTokenTemplatePositionFetcher<QiDaoYieldToken> {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.yield.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Yield Tokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): QiDaoYieldToken {
    return this.contractFactory.qiDaoYieldToken({ address, network: this.network });
  }

  async getAddresses() {
    return [
      '0x22965e296d9a0cd0e917d6d70ef2573009f8a1bb', // camUSDC
      '0x7068ea5255cb05931efa8026bd04b18f3deb8b0b', // camWMATIC
      '0xe6c23289ba5a9f0ef31b8eb36241d5c800889b7b', // camDAI
      '0x0470cd31c8fcc42671465880ba81d631f0b76c1d', // camWETH
      '0xb3911259f435b28ec072e4ff6ff5a2c604fea0fb', // camUSDT
      '0xea4040b21cb68afb94889cb60834b13427cfc4eb', // camAAVE
      '0xba6273a78a23169e01317bd0f6338547f869e8df', // camWBTC
    ];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<QiDaoYieldToken>) {
    return contract.Token();
  }

  async getPricePerShare({ appToken }: GetPricePerShareParams<QiDaoYieldToken>) {
    const underlyingToken = appToken.tokens[0];
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = underlyingTokenContract.balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<QiDaoYieldToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<QiDaoYieldToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<QiDaoYieldToken>) {
    return 0;
  }
}
