import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { CompoundViemContractFactory } from '~apps/compound/contracts';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { BProtocolViemContractFactory } from '../contracts';
import { BProtocolCompoundComptroller, BProtocolCompoundToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumBProtocolCompoundBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
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

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<BProtocolCompoundToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getBorrowRate({
    contract,
    multicall,
  }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    const cTokenAddress = await contract.read.cToken();
    const cToken = this.compoundContractFactory.compoundCToken({ address: cTokenAddress, network: this.network });
    return multicall
      .wrap(cToken)
      .read.borrowRatePerBlock()
      .catch(() => 0);
  }

  async getCash({ contract, multicall }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    const cTokenAddress = await contract.read.cToken();
    const cToken = this.compoundContractFactory.compoundCToken({ address: cTokenAddress, network: this.network });
    return multicall
      .wrap(cToken)
      .read.getCash()
      .catch(() => 0);
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.simulate.borrowBalanceCurrent([address]).then(v => v.result);
  }
}
