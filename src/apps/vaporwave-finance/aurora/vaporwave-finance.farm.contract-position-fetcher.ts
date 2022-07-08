import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { buildDollarDisplayItem } from "~app-toolkit/helpers/presentation/display-item.present";

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VaporwaveFinanceContractFactory } from '../contracts';
import { VAPORWAVE_FINANCE_DEFINITION } from '../vaporwave-finance.definition';
import { getRegisteredToken } from './vaporwave-finance.vault.token-fetcher';
import { claimable, supplied } from "~position/position.utils";
import { ContractType } from "~position/contract.interface";
import auroraStakePools from './aurora_stake'
import { CacheOnInterval } from "~cache/cache-on-interval.decorator";
import TRISOLARIS_DEFINITION from '~apps/trisolaris/trisolaris.definition';
import { DefaultDataProps } from '~position/display.interface';

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


  @CacheOnInterval({
    key: `apps-v3:${network}:${appId}:${groupId}:want_prices`,
    timeout: 15 * 60 * 1000,
  })
  async getWantPrices() {
    const wantPrices = await Axios.get("https://api.vaporwave.farm/lps").then(
      (v) => v.data
    )
    return wantPrices
  }

  @CacheOnInterval({
    key: `apps-v3:${network}:${appId}:${groupId}:base_token`,
    timeout: 15 * 60 * 1000,
  })
  async getBaseTokenPrices() {
    const baseTokenPrices = await Axios.get("https://api.vaporwave.farm/prices").then(
      (v) => v.data
    )
    return baseTokenPrices
  }


  async getPositions() {
    // http://localhost:5001/apps/vaporwave-finance/positions?groupIds[]=farm&network=aurora
    const wantPrices = await this.getWantPrices()
    const baseTokenPrices = await this.getBaseTokenPrices()

    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId: TRISOLARIS_DEFINITION.id, groupIds: [TRISOLARIS_DEFINITION.groups.pool.id], network });
    const allTokens = [...appTokens, ...baseTokens];

    const positions = await Promise.all(
      auroraStakePools.map(
        async ({
          earnContractAddress,
          earnedTokenAddress,
          tokenAddress,
          token,
          logo,
          earnedOracleId,
        }) => {

          const stakedToken = await getRegisteredToken(tokenAddress, token, allTokens)
          const earnedToken = await getRegisteredToken(earnedTokenAddress, earnedOracleId, allTokens)
          if (!stakedToken || !earnedToken) return null;


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

    return positions.filter((x): x is ContractPosition<DefaultDataProps> => x !== null)
  }
}
