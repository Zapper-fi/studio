import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

import { PENGUIN_DEFINITION } from '../penguin.definition';

const appId = PENGUIN_DEFINITION.id;
const groupId = PENGUIN_DEFINITION.groups.vaultClaimable.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalanchePenguinVaultClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const vaultTokens = await this.appToolkit.getAppTokenPositions({
      appId: PENGUIN_DEFINITION.id,
      groupIds: [PENGUIN_DEFINITION.groups.vault.id],
      network,
    });

    const [xPefiToken] = await this.appToolkit.getAppTokenPositions({
      appId: PENGUIN_DEFINITION.id,
      groupIds: [PENGUIN_DEFINITION.groups.xPefi.id],
      network,
    });

    if (!xPefiToken) return [];

    const positions = vaultTokens.map(token => {
      const position: ContractPosition = {
        type: ContractType.POSITION,
        address: token.address,
        appId,
        groupId,
        network,
        tokens: [xPefiToken],
        dataProps: {},
        displayProps: {
          label: `Claimable ${xPefiToken.symbol}`,
          secondaryLabel: buildDollarDisplayItem(xPefiToken.price),
          images: getImagesFromToken(xPefiToken),
        },
      };

      return position;
    });

    return positions;
  }
}
