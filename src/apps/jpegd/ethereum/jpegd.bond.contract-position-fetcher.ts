import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { OlympusBondContractPositionHelper } from '~apps/olympus/helpers/olympus.bond.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { JPEGD_DEFINITION } from '../jpegd.definition';

const appId = JPEGD_DEFINITION.id;
const groupId = JPEGD_DEFINITION.groups.bond.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumJpegdBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const depositories = [{ depositoryAddress: '0x84f0015998021fe53fdc7f1c299bd7c92fccd455', symbol: 'JPEG-ETH LP' }];

    const jpegToken = baseTokens.find(x => x.address === '0xe80c0cd204d654cebe8dd64a4857cab6be8345a3');
    if (!jpegToken) return [];

    return this.olympusContractPositionHelper.getPositions({
      appId,
      network,
      groupId,
      depositories,
      mintedTokenAddress: jpegToken.address,
    });
  }
}
