import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

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

  async getPricePerShare({
    contract,
    multicall,
  }: GetPricePerShareParams<ChickenBondBlusd>): Promise<number | number[]> {
    const chickenBondManagerContract = this.contractFactory.chickenBondManager({
      address: '0x57619fe9c539f890b19c61812226f9703ce37137',
      network: this.network,
    });
    const [lusdInSpRaw, lusdInCurveRaw, totalSupplyRaw] = await Promise.all([
      multicall.wrap(chickenBondManagerContract).getAcquiredLUSDInSP(),
      multicall.wrap(chickenBondManagerContract).getAcquiredLUSDInCurve(),
      contract.totalSupply(),
    ]);

    const [lusdInSp, lusdInCurve, totalSupply] = [Number(lusdInSpRaw), Number(lusdInCurveRaw), Number(totalSupplyRaw)];

    //redemption_price = LUSD in the Reserve / total bLUSD supply
    const redemptionPrice = (lusdInSp + lusdInCurve) / totalSupply;

    return redemptionPrice;
  }

  getLiquidity({ appToken }: GetDataPropsParams<ChickenBondBlusd>) {
    return appToken.price * appToken.supply;
  }

  getReserves({ appToken }: GetDataPropsParams<ChickenBondBlusd>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
