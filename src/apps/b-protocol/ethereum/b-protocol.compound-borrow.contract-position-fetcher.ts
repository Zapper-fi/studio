import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { CompoundContractFactory } from '~apps/compound';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { IMulticallWrapper } from '~multicall';
import {
  GetTokenDefinitionsParams,
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { B_PROTOCOL_DEFINITION } from '../b-protocol.definition';
import { BProtocolCompoundComptroller, BProtocolCompoundToken, BProtocolContractFactory } from '../contracts';

export class EthereumBProtocolCompoundBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  BProtocolCompoundToken,
  BProtocolCompoundComptroller
> {
  appId = B_PROTOCOL_DEFINITION.id;
  groupId = B_PROTOCOL_DEFINITION.groups.compoundBorrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Compound Lending';
  comptrollerAddress = '0x9db10b9429989cc13408d7368644d4a1cb704ea3';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BProtocolContractFactory) protected readonly contractFactory: BProtocolContractFactory,
    @Inject(CompoundContractFactory) protected readonly compoundContractFactory: CompoundContractFactory,
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
    const cTokenAddresses = await contract.getAllMarkets();
    const bTokenAddresses = await Promise.all(cTokenAddresses.map(cTokenAddress => contract.c2b(cTokenAddress)));
    return bTokenAddresses.filter(v => v !== ZERO_ADDRESS);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<BProtocolCompoundToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getBorrowRate({
    contract,
    multicall,
  }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    const cTokenAddress = await contract.cToken();
    const cToken = this.compoundContractFactory.compoundCToken({ address: cTokenAddress, network: this.network });
    return multicall
      .wrap(cToken)
      .borrowRatePerBlock()
      .catch(() => 0);
  }

  async getCash({ contract, multicall }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    const cTokenAddress = await contract.cToken();
    const cToken = this.compoundContractFactory.compoundCToken({ address: cTokenAddress, network: this.network });
    return multicall
      .wrap(cToken)
      .getCash()
      .catch(() => 0);
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BProtocolCompoundToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }
}
