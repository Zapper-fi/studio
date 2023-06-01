import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { ZhartaContractFactory, ZhartaLendingPoolCore } from '../contracts';

interface ZhartaLendingPoolCoreContractPositionDefinition extends DefaultContractPositionDefinition {
  type: 'LENDING_POOL_CORE';
}

@PositionTemplate()
export class EthereumZhartaLendingPoolCoreContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ZhartaLendingPoolCore> {
  groupLabel = 'Deposits';
  contracts = ['0xE3c959Bc97b92973d5367DBF4cE1b7b9660Ee271'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ZhartaContractFactory) protected readonly contractFactory: ZhartaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): ZhartaLendingPoolCore {
    return this.contractFactory.zhartaLendingPoolCore({ address: _address, network: this.network });
  }

  async getDefinitions(): Promise<ZhartaLendingPoolCoreContractPositionDefinition[]> {
    return this.contracts.map(address => ({
      address,
      type: 'LENDING_POOL_CORE',
    }));
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<ZhartaLendingPoolCore, ZhartaLendingPoolCoreContractPositionDefinition>,
  ) {
    const {
      definition: { type },
    } = _params;
    switch (type) {
      case 'LENDING_POOL_CORE':
        return this.getRegularTokenDefinitions(_params);
    }
  }

  private async getRegularTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<ZhartaLendingPoolCore, ZhartaLendingPoolCoreContractPositionDefinition>) {
    const [depositAddress] = await Promise.all([
      contract.erc20TokenContract()
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: depositAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: depositAddress,
        network: this.network,
      }
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ZhartaLendingPoolCore>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `${getLabelFromToken(suppliedToken)} Pool`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall
  }: GetTokenBalancesParams<ZhartaLendingPoolCore>) {
    const [lenderFundsRaw, withdrawableAmountRaw] = await Promise.all([
      contract.funds(address),
      contract.computeWithdrawableAmount(address)
    ]);

    return [lenderFundsRaw.currentAmountDeposited, withdrawableAmountRaw.sub(lenderFundsRaw.currentAmountDeposited)];
  }
}
