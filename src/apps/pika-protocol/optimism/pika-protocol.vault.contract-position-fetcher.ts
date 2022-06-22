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

import { PikaProtocolContractFactory } from '../contracts';
import { PIKA_PROTOCOL_DEFINITION } from '../pika-protocol.definition';

const appId = PIKA_PROTOCOL_DEFINITION.id;
const groupId = PIKA_PROTOCOL_DEFINITION.groups.vault.id;
const network = Network.OPTIMISM_MAINNET;

const VAULTS = [
  // USDC
  {
    address: '0x2fae8c7edd26213ca1a88fc57b65352dbe353698',
    stakedTokenAddress: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    rewardTokenAddress: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  },
];

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class OptimismPikaProtocolVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolContractFactory) private readonly pikaProtocolContractFactory: PikaProtocolContractFactory,
  ) {}

  // Adds helper function to check the `balanceOf` PikaProtocolVault
  async getVaultBalance(vaultContractAddress: string, depositTokenAddress: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const depositTokenContract = multicall.wrap(
      this.appToolkit.globalContracts.erc20({ network, address: depositTokenAddress }),
    );
    return await Promise.all([depositTokenContract.balanceOf(vaultContractAddress)]);
  }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId, groupIds: [groupId], network });

    const allTokens = [...appTokens, ...baseTokens];

    const positions = await Promise.all(
      VAULTS.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;

        const contract = this.pikaProtocolContractFactory.pikaProtocolVault({ address, network });
        const balanceRaw = await this.getVaultBalance(contract.address, stakedToken.address);
        const liquidity = Number(balanceRaw) / 10 ** stakedToken.decimals;
        const tokens = [supplied(stakedToken), claimable(rewardToken)];

        const label = `Staked ${getLabelFromToken(stakedToken)}`;
        const images = getImagesFromToken(stakedToken);
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
          network,
          tokens,
          dataProps: { liquidity },
          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
          },
        };

        return position;
      }),
    );
    return compact(positions);
  }
}
