import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

@Injectable()
export class SolacePolicyBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  getBalances({ address, network }: { address: string; network: Network }) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.policies.id,
      network,
      resolveBalances: async ({ address, contractPosition }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;

        const product = this.solaceContractFactory.solaceCoverProduct({ address: contractPosition.address, network });
        const bal = await product.accountBalanceOf(address);

        return [drillBalance(stakedToken, bal.toString())];
      },
    });
  }
}
