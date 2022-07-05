import { Inject } from '@nestjs/common';
import { compact } from "lodash";
import Axios from 'axios';
import { buildDollarDisplayItem } from "~app-toolkit/helpers/presentation/display-item.present";

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VaporwaveFinanceContractFactory } from '../contracts';
import { VAPORWAVE_FINANCE_DEFINITION } from '../vaporwave-finance.definition';
import { getBaseERC20Token } from './vaporwave-finance.vault.token-fetcher';
import { claimable, supplied } from "~position/position.utils";
import { ContractType } from "~position/contract.interface";
import auroraStakePools from './aurora_stake'


const appId = VAPORWAVE_FINANCE_DEFINITION.id;
const groupId = VAPORWAVE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraVaporwaveFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VaporwaveFinanceContractFactory)
    private readonly vaporwaveFinanceContractFactory: VaporwaveFinanceContractFactory,
  ) { }

  async getPositions() {
    // http://localhost:5001/apps/vaporwave-finance/positions?groupIds[]=farm&network=aurora
    const wantPrices = await Axios.get("https://api.vaporwave.farm/lps").then(
      (v) => v.data
    )
    const baseTokenPrices = await Axios.get("https://api.vaporwave.farm/prices").then(
      (v) => v.data
    )
    const multicall = this.appToolkit.getMulticall(network);

    const positions = await Promise.all(
      auroraStakePools.map(
        async ({
          earnContractAddress,
          earnedTokenAddress,
          tokenAddress,
          token,
          logo,
        }) => {

          const stakedToken = await getBaseERC20Token(tokenAddress, this.appToolkit)
          const earnedToken = await getBaseERC20Token(earnedTokenAddress, this.appToolkit)
          // get prices!

          const tokens = [supplied(stakedToken), claimable(earnedToken)];

          // Instantiate a smart contract instance pointing to the jar token address
          const stakedTokenContract = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network });

          // Request the jar token balance of this farm
          const [balanceRaw] = await Promise.all([
            multicall.wrap(stakedTokenContract).balanceOf(earnContractAddress),
          ]);

          // Denormalize the balance as the TVL
          const totalValueLocked =
            Number(balanceRaw) / 10 ** stakedToken.decimals;

          // As a label, we'll use the underlying label, and prefix it with 'Staked'
          const label = `Staked ${token}`;
          const images = [`https://raw.githubusercontent.com/VaporwaveFinance/vwave-app-pub/main/src/${logo}`]
          const price = wantPrices[stakedToken.symbol] || baseTokenPrices[stakedToken.symbol]
          const secondaryLabel = buildDollarDisplayItem(price);

          // Create the contract position object
          const position: ContractPosition = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: earnContractAddress,
            network,
            tokens,
            dataProps: {
              totalValueLocked,
            },
            displayProps: {
              label,
              secondaryLabel,
              images,
            },
          };

          return position;
        }
      )
    );

    return positions
  }
}
