import { Inject, Injectable } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { compact, padEnd } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';
import { asciiToHex } from '~utils/web3.utils';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixSynthTokenBalanceHelperParams = {
  address: string;
  network: Network;
  resolverAddress: string;
};

@Injectable()
export class SynthetixSynthTokenBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getBalances({ address, network, resolverAddress }: SynthetixSynthTokenBalanceHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const synthTokens = await this.appToolkit.getAppTokenPositions({
      appId: SYNTHETIX_DEFINITION.id,
      groupIds: [SYNTHETIX_DEFINITION.groups.synth.id],
      network,
    });

    // Resolve address of the SynthUtil contract and Synthetix token contract
    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: resolverAddress,
      network,
    });

    // Get synth balances
    const synthUtilName = padEnd(asciiToHex('SynthUtil'), 66, '0');
    const synthUtilAddress = await multicall.wrap(addressResolverContract).getAddress(synthUtilName);
    const synthUtilContract = this.contractFactory.synthetixSummaryUtil({ address: synthUtilAddress, network });
    const synthBalances = await multicall.wrap(synthUtilContract).synthsBalances(address);

    const synthTokenBalances = synthBalances[0].map((s, i) => {
      const symbol = parseBytes32String(s);
      const token = synthTokens.find(t => t.symbol === symbol);
      if (!token) return null;

      const balanceRaw = synthBalances[1][i];
      return drillBalance(token, balanceRaw.toString());
    });

    return compact(synthTokenBalances);
  }
}
