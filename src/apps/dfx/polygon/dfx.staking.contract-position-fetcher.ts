import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { Addresses } from '../addresses';
import { DfxContractFactory } from '../contracts';
import { DFX_DEFINITION } from '../dfx.definition';

const appId = DFX_DEFINITION.id;
const groupId = DFX_DEFINITION.groups.staking.id;
const network = Network.POLYGON_MAINNET;

type DfxCurveContractPositionDataProps = {
  liquidity: number;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonDfxStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DfxContractFactory) private readonly dfxContractFactory: DfxContractFactory,
  ) {}

  async getPositions() {
    const stakingDefinitions = Addresses[network].amm.map(({ staking: stakingAddress, curve: curveAddress }) => ({
      address: stakingAddress.toLowerCase(),
      stakedTokenAddress: curveAddress.toLowerCase(),
      rewardTokenAddress: Addresses[network].dfx.toLowerCase(),
    }));

    // Reward token is DFX which is a base token
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    // Staked tokens are DFX LPs so resolve these
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId: 'dfx', groupIds: ['dfx-curve'], network });
    const allTokens = [...baseTokens, ...appTokens];

    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);

    const positions = await Promise.all(
      stakingDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address.toLowerCase() === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address.toLowerCase() === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;

        const tokens = [supplied(stakedToken), claimable(rewardToken)];

        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.dfxContractFactory.dfxCurve({ address: stakedToken.address, network });

        // Request the jar token balance of this farm
        const [balanceRaw] = await Promise.all([multicall.wrap(contract).balanceOf(address)]);

        // Denormalize the balance as the TVL
        const liquidity = Number(balanceRaw) / 10 ** stakedToken.decimals;

        // Prepare display props
        const label = `Staked ${getLabelFromToken(stakedToken)}`;
        const images = getImagesFromToken(stakedToken);
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        const position: ContractPosition<DfxCurveContractPositionDataProps> = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
          network,
          tokens,
          dataProps: {
            liquidity,
          },
          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };
        return position;
      }),
    );
    return _.compact(positions);
  }
}
