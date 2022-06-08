import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { ContractType } from '~position/contract.interface';


import { VotiumContractFactory } from '../contracts';
import { VOTIUM_DEFINITION } from '../votium.definition';

const appId = VOTIUM_DEFINITION.id;
const groupId = VOTIUM_DEFINITION.groups.rewards.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumVotiumRewardsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VotiumContractFactory) private readonly votiumContractFactory: VotiumContractFactory,
  ) {}

  async getPositions() {
		const rewardTokens = await Axios.get<VotiumTokenDetails[]>(
		      'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json',
		    ).then(v => v.data);

		const multicall = this.appToolkit.getMulticall(network);

		const tokens = await Promise.all(
      rewardTokens.map(async tok => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.votiumContractFactory.votiumErc20({ address: tok.value, network });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: tok.value,
          network,
          symbol,
          decimals,
          supply,
        };

        return token;
      }),
    );

    return tokens;
  }
}
