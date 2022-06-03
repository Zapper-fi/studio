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
    address: '0x2FaE8C7Edd26213cA1A88fC57B65352dbe353698'.toLowerCase(),
    stakedTokenAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'.toLowerCase(),
    rewardTokenAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'.toLowerCase()
  }

]

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismPikaProtocolVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolContractFactory) private readonly pikaProtocolContractFactory: PikaProtocolContractFactory,
  ) { }


  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId, groupIds: [groupId], network });

    const allTokens = [...appTokens, ...baseTokens];
    const multicall = this.appToolkit.getMulticall(network);

    const positions = await Promise.all(
      VAULTS.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;

        const tokens = [supplied(stakedToken), claimable(rewardToken)];

        const contract = this.pikaProtocolContractFactory.pikaProtocolVault({ address, network });

        const [balanceRaw] = await this.pikaProtocolContractFactory.vaultBalance(contract.address, stakedTokenAddress, network, multicall);

        const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;

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
          dataProps: { totalValueLocked },
          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return position;
      }),
    );
    return compact(positions);
  }
}
