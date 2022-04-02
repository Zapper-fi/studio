import { Inject, Injectable } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { compact, padEnd } from 'lodash';
import Web3 from 'web3';

import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

type GetSynthBalancesOptions = {
  address: string;
  network: Network;
  resolverAddress: string;
};

@Injectable()
export class SynthetixSynthBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  public async getSynthBalances({ address, network, resolverAddress }: GetSynthBalancesOptions) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
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

    const synthUtilName = padEnd(Web3.utils.asciiToHex('SynthUtil'), 66, '0');
    const synthTokenName = padEnd(Web3.utils.asciiToHex('Synthetix'), 66, '0');
    const [synthUtilAddress, synthTokenAddress] = await Promise.all([
      multicall.wrap(addressResolverContract).getAddress(synthUtilName),
      multicall.wrap(addressResolverContract).getAddress(synthTokenName),
    ]);

    // Get SNX balance and synth balances
    const synthUtilContract = this.contractFactory.synthetixSummaryUtil({ address: synthUtilAddress, network });
    const synthetixContract = this.contractFactory.synthetixNetworkToken({ address: synthTokenAddress, network });
    const [transferrableBalanceRaw, supplyRaw, synthBalances] = await Promise.all([
      multicall.wrap(synthetixContract).transferableSynthetix(address),
      multicall.wrap(synthetixContract).totalSupply(),
      multicall.wrap(synthUtilContract).synthsBalances(address),
    ]);

    // NOTE: SNX token is non-standard, so we treat it as an AppToken
    // Short term: The `exchangeableTokens` query needs to make use of these token balances
    // Long term: Tokens rewrite, and foundational work to _register base tokens_ to the root scope
    const snxToken = baseTokens.find(p => p.symbol === 'SNX')!;
    const snxAppToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.synth.id,
      network: network,
      address: snxToken.address,
      decimals: snxToken.decimals,
      symbol: snxToken.symbol,
      supply: Number(supplyRaw) / 10 ** snxToken.decimals,
      price: snxToken.price,
      pricePerShare: 1,
      tokens: [],

      dataProps: {},

      displayProps: {
        label: snxToken.symbol,
        secondaryLabel: buildDollarDisplayItem(snxToken.price),
        images: [getTokenImg(snxToken.address, network)],
      },
    };

    const snxTokenBalance = drillBalance(snxAppToken, transferrableBalanceRaw.toString());
    const synthTokenBalances = synthBalances[0].map((s, i) => {
      const symbol = parseBytes32String(s);
      const token = synthTokens.find(t => t.symbol === symbol);
      if (!token) return null;

      const balanceRaw = synthBalances[1][i];
      return drillBalance(token, balanceRaw.toString());
    });

    return [snxTokenBalance, ...compact(synthTokenBalances)];
  }
}
