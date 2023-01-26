import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { Vaults, ThalesContractFactory } from '../contracts';


let vaultAddressToName = new Map<string, string>([
  ['0xb484027cb0c538538bad2be492714154f9196f93', 'Thales Discount'],
  ['0x43318de9e8f65b591598f17add87ae7247649c83', 'Thales Degen Discount'],
  ['0x6c7fd4321183b542e81bcc7de4dfb88f9dbca29f', 'Thales Safu Discount'],
  ['0xc922f4cde42dd658a7d3ea852caf7eae47f6cecd', 'Overtime Discount'],
  ['0xbaac5464bf6e767c9af0e8d4677c01be2065fd5f', 'Overtime Degen Discount'],
  ['0x43d19841d818b2ccc63a8b44ce8c7def8616d98e', 'Overtime Safu Discount'],
]);

@PositionTemplate()
export class OptimismThalesVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Vaults> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Vaults {
    return this.contractFactory.vaults({ network: this.network, address });
  }

  async getDefinitions() {
    let definitions = new Array;
    for (let vaultAddress of vaultAddressToName.keys()) {
      definitions.push({ address: vaultAddress })
    }
    return definitions;
  }

  async getTokenDefinitions() {
    return [
      {
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Vaults>) {
    return `${vaultAddressToName.get(contractPosition.address)} Vault`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Vaults>): Promise<BigNumberish[]> {
    const currentRound = await contract.round();
    const currentBalance = await contract.getBalancesPerRound(Number(currentRound), address);
    const pendingdeposit = await contract.getBalancesPerRound(Number(currentRound) + 1, address);
    return [sum(currentBalance, pendingdeposit)];
  }
}
