import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPriceParams } from '~position/template/app-token.template.types';

import { ChickenBondViemContractFactory } from '../contracts';
import { ChickenBondBlusd } from '../contracts/viem';

@PositionTemplate()
export class EthereumChickenBondBlusdTokenFetcher extends AppTokenTemplatePositionFetcher<ChickenBondBlusd> {
  groupLabel = 'bLUSD';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ChickenBondViemContractFactory) protected readonly contractFactory: ChickenBondViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.chickenBondBlusd({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xb9d7dddca9a4ac480991865efef82e01273f79c3'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice({ multicall }: GetPriceParams<ChickenBondBlusd>): Promise<number> {
    // Temporary solution until Curve is migrated to template
    const curvePoolContract = this.contractFactory.curvePool({
      address: '0x74ed5d42203806c8cdcf2f04ca5f60dc777b901c',
      network: this.network,
    });
    const oneUnit = BigNumber.from(10).pow(18);

    const priceRaw = await multicall.wrap(curvePoolContract).read.get_dy([0, 1, oneUnit]);
    const price = Number(priceRaw) / 10 ** 18;

    return price;
  }
}
