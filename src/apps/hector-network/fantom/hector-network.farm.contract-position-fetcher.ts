import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

export type HectorNetworkFarmContractPositionDataProps = {
  totalValueLocked: number;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) private readonly hectorNetworkContractFactory: HectorNetworkContractFactory,
  ) {}

  async getPositions() {
    const farmDefinitions = [
      {
        address: '0x24699312cb27c26cfc669459d670559e5e44ee60', // TOR + DAI + USDC: CurveLP
        stakedTokenAddress: '0x74e23df9110aa9ea0b6ff2faee01e740ca1c642e', // TOR
        rewardTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
      },
      {
        address: '0x24699312cb27c26cfc669459d670559e5e44ee60', // TOR + DAI + USDC: CurveLP
        stakedTokenAddress: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
        rewardTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
      },
      {
        address: '0x24699312cb27c26cfc669459d670559e5e44ee60', // TOR + DAI + USDC: CurveLP
        stakedTokenAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
        rewardTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
      },
      {
        address: '0x41d88635029c4402bf9914782ae55c412f8f2142', // FTM + TOR: SpookyLP
        stakedTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
        rewardTokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
      },
      {
        address: '0x41d88635029c4402bf9914782ae55c412f8f2142', // FTM + TOR: SpookyLP
        stakedTokenAddress: '0x74e23df9110aa9ea0b6ff2faee01e740ca1c642e', // TOR
        rewardTokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
      },
      {
        address: '0x0bfe6f893a6bc443b575ddf361a30f39aa03e59c', // FTM + wsHEC: SpookyLP
        stakedTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
        rewardTokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
      },
      {
        address: '0x0bfe6f893a6bc443b575ddf361a30f39aa03e59c', // FTM + wsHEC: SpookyLP
        stakedTokenAddress: '0x94ccf60f700146bea8ef7832820800e2dfa92eda', // wsHEC
        rewardTokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
      },
    ];

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'hector-network',
      groupIds: ['ws-hec'],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];
    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      farmDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;

        const tokens = [supplied(stakedToken), claimable(rewardToken)];
        const contract = this.hectorNetworkContractFactory.hectorNetworkToken({
          address: stakedToken.address,
          network,
        });
        const [balanceRaw] = await Promise.all([multicall.wrap(contract).balanceOf(address)]);
        const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;

        // As a label, we'll use the underlying label, and prefix it with 'Staked'
        const label = `Staked ${getLabelFromToken(stakedToken)}`;
        // For images, we'll use the underlying token images as well
        const images = getImagesFromToken(stakedToken);
        // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        // Create the contract position object
        const position: ContractPosition<HectorNetworkFarmContractPositionDataProps> = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
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
      }),
    );

    return compact(tokens);
  }
}
