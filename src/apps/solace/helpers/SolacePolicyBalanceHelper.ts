import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const SOLACE_COVER_POINTS_ADDRESS = '0x501ace72166956f57b44dbbcc531a8e741449997';
const SOLACE_COVER_PRODUCT_ADDRESS = '0x501aceb72d62c9875825b71d9f78a27780b5624d';

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
        // does the user have a policy?
        const spi = this.solaceContractFactory.solaceCoverProductV3({ address: SOLACE_COVER_PRODUCT_ADDRESS, network });
        const policyID = await spi.policyOf(address);
        if (policyID.eq(0)) return [];
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;
        const scp = this.solaceContractFactory.erc20({ address: SOLACE_COVER_POINTS_ADDRESS, network });
        const balRaw = await scp.balanceOf(address);
        return [drillBalance(stakedToken, balRaw.toString())];
      },
    });
  }
}
