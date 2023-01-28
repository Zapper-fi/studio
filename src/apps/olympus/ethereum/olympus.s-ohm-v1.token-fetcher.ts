import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { OlympusContractFactory, OlympusSOhmV1Token } from '../contracts';

@PositionTemplate()
export class EthereumOlympusSOhmV1TokenFetcher extends AppTokenTemplatePositionFetcher<OlympusSOhmV1Token> {
  groupLabel = 'sOHM v1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) protected readonly contractFactory: OlympusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OlympusSOhmV1Token {
    return this.contractFactory.olympusSOhmV1Token({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x383518188c0c6d7730d91b2c03a03c837814a899', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLiquidity({ appToken, multicall }: GetDataPropsParams<OlympusSOhmV1Token>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xfd31c7d00ca47653c6ce64af53c1571f9c36566a';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(reserveAddress);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve * underlyingToken.price;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<OlympusSOhmV1Token>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xfd31c7d00ca47653c6ce64af53c1571f9c36566a';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(reserveAddress);
    return [Number(reserveRaw) / 10 ** underlyingToken.decimals];
  }
}
