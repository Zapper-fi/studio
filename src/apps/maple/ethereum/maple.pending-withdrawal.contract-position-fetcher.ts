import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { MapleViemContractFactory } from '../contracts';
import { MapleWithdrawalManager } from '../contracts/viem';

export type MaplePendingWithdrawalContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumMaplePendingWithdrawalContractPositionFetcher extends ContractPositionTemplatePositionFetcher<MapleWithdrawalManager> {
  groupLabel = 'Pending Withdrawals';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MapleViemContractFactory) protected readonly contractFactory: MapleViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mapleWithdrawalManager({ address, network: this.network });
  }

  async getDefinitions({
    multicall,
  }: GetDefinitionsParams): Promise<MaplePendingWithdrawalContractPositionDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      groupIds: ['pool'],
      network: this.network,
    });

    return Promise.all(
      appTokens.map(async appToken => {
        const poolContract = this.contractFactory.maplePool({
          network: this.network,
          address: appToken.address.toLowerCase(),
        });
        const [managerAddressRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(poolContract).read.manager(),
          multicall.wrap(poolContract).read.asset(),
        ]);

        const poolManagerContract = this.contractFactory.maplePoolManager({
          network: this.network,
          address: managerAddressRaw.toLowerCase(),
        });

        const withdrawlManagerAddressRaw = await multicall.wrap(poolManagerContract).read.withdrawalManager();

        return {
          address: withdrawlManagerAddressRaw.toLowerCase(),
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
        };
      }),
    );
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MapleWithdrawalManager, MaplePendingWithdrawalContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.LOCKED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MapleWithdrawalManager>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<MapleWithdrawalManager>): Promise<BigNumberish[]> {
    return [await contract.read.lockedShares([address])];
  }
}
