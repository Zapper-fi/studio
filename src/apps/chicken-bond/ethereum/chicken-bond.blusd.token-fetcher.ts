import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPriceParams } from '~position/template/app-token.template.types';

import { ChickenBondBlusd, ChickenBondContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumChickenBondBlusdTokenFetcher extends AppTokenTemplatePositionFetcher<ChickenBondBlusd> {
  groupLabel = 'bLUSD';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ChickenBondContractFactory) protected readonly contractFactory: ChickenBondContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ChickenBondBlusd {
    return this.contractFactory.chickenBondBlusd({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xb9d7dddca9a4ac480991865efef82e01273f79c3'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x5f98805a4e8be255a32880fdec7f6728c6568ba0'];
  }

  async getPrice({ multicall }: GetPriceParams<ChickenBondBlusd>): Promise<number> {
    // Temporary solution until Curve is migrated to template
    const curvePoolContract = this.contractFactory.curvePool({
      address: '0x74ed5d42203806c8cdcf2f04ca5f60dc777b901c',
      network: this.network,
    });
    const oneUnit = BigNumber.from(10).pow(18);

    const priceRaw = await multicall.wrap(curvePoolContract).get_dy(0, 1, oneUnit);
    const price = Number(priceRaw) / 10 ** 18;

    return price;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<ChickenBondBlusd>) {
    return appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<ChickenBondBlusd>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
