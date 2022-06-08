import { Inject } from '@nestjs/common';
import Axios from 'axios';
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

import { LizTestContractFactory } from '../contracts';
import { LIZ_TEST_DEFINITION } from '../liz-test.definition';

const appId = LIZ_TEST_DEFINITION.id;
const groupId = LIZ_TEST_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

// Define a partial of the return type from the Pickle API
export type PickleVaultDetails = {
  jarAddress: string;
  gaugeAddress: string;
  network: string;
};

export type PickleFarmContractPositionDataProps = {
  totalValueLocked: number;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLizTestFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LizTestContractFactory) private readonly lizTestContractFactory: LizTestContractFactory,
  ) {}

  async getPositions() {
    // Retrieve pool addresses from the Pickle API
    const endpoint = 'https://api.pickle.finance/prod/protocol/pools';
    const data = await Axios.get<PickleVaultDetails[]>(endpoint).then(v => v.data);
    const ethData = data.filter(({ network }) => network === 'eth');
    const farmDefinitions = ethData
      .filter(({ gaugeAddress }) => !!gaugeAddress)
      .map(({ jarAddress, gaugeAddress }) => ({
        address: gaugeAddress.toLowerCase(),
        stakedTokenAddress: jarAddress.toLowerCase(),
        rewardTokenAddress: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5', // PICKLE
      }));

    // Return _anything_ so we can see a result right now!
    //return farmDefinitions as any;
    //}

    // The reward token is PICKLE, which is a base token
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    // ...and the staked tokens are Pickle Jar tokens, so resolve these app tokens
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId: 'pickle', groupIds: ['jar'], network });

    // ...combine these together as our index for finding token dependencies
    const allTokens = [...appTokens, ...baseTokens];
    const multicall = this.appToolkit.getMulticall(network);

    // We will build a token object for each jar address, using data retrieved on-chain with Ethers
    const tokens = await Promise.all(
      farmDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;

        const tokens = [supplied(stakedToken), claimable(rewardToken)];
        const contract = this.lizTestContractFactory.pickleJar({ address: stakedToken.address, network });
        const [balanceRaw] = await Promise.all([multicall.wrap(contract).balanceOf(address)]);
        const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;

        // As a label, we'll use the underlying label, and prefix it with 'Staked'
        const label = `Staked ${getLabelFromToken(stakedToken)}`;
        // For images, we'll use the underlying token images as well
        const images = getImagesFromToken(stakedToken);
        // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        // Create the contract position object
        const position: ContractPosition<PickleFarmContractPositionDataProps> = {
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
