import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import { CompoundViemContractFactory } from '~apps/compound/contracts';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BProtocolViemContractFactory } from '../contracts';
import { BProtocolCompoundComptroller, BProtocolCompoundToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumBProtocolCompoundSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  BProtocolCompoundToken,
  BProtocolCompoundComptroller
> {
  groupLabel = 'Compound Lending';
  comptrollerAddress = '0x9db10b9429989cc13408d7368644d4a1cb704ea3';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BProtocolViemContractFactory) protected readonly contractFactory: BProtocolViemContractFactory,
    @Inject(CompoundViemContractFactory) protected readonly compoundContractFactory: CompoundViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.bProtocolCompoundToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.bProtocolCompoundComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<BProtocolCompoundComptroller>) {
    const cTokenAddresses = await contract.read.getAllMarkets().then(v => [...v]);
    const bTokenAddresses = await Promise.all(cTokenAddresses.map(cTokenAddress => contract.read.c2b([cTokenAddress])));
    return bTokenAddresses.filter(v => v !== ZERO_ADDRESS);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<BProtocolCompoundToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<BProtocolCompoundToken>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getSupplyRate({ contract, multicall }: GetDataPropsParams<BProtocolCompoundToken>) {
    const cTokenAddress = await contract.read.cToken();
    const cToken = this.compoundContractFactory.compoundCToken({ address: cTokenAddress, network: this.network });
    return multicall
      .wrap(cToken)
      .read.supplyRatePerBlock()
      .catch(() => 0);
  }
}
