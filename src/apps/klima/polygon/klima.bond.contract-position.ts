import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { OlympusBondContractPositionHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KLIMA_DEFINITION } from '../klima.definition';

const appId = KLIMA_DEFINITION.id;
const groupId = KLIMA_DEFINITION.groups.bond.id;
const network = Network.POLYGON_MAINNET;

const BCT_ADDRESS = '0x2f800db0fdb5223b3c3f354886d907a671414a7f';
const USDC_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
const MC02_ADDRESS = '0xfc98e825a2264d890f9a1e68ed50e1526abccacd';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonKlimaBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}
  async getPositions() {
    const klimaToken = await this.appToolkit.getBaseTokenPrice({
      address: KLIMA_DEFINITION.token!.address,
      network,
    });

    if (!klimaToken) return [];

    const depositories = [
      {
        depositoryAddress: '0x7de627c56d26529145a5f9d85948ecbeaf9a4b34',
        symbol: 'BCT LP',
        images: [getTokenImg(BCT_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x27217c3f5bec4c12fa506a101bc4bd15417aeaa8',
        symbol: 'MC02 LP',
        images: [getTokenImg(MC02_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x1e0dd93c81ac7af2974cdb326c85b87dd879389b',
        symbol: 'KLIMA-BCT LP',
        images: [getAppImg(appId), getTokenImg(BCT_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xbf2a35efcd85e790f02458db4a3e2f29818521c5',
        symbol: 'BCT-USDC LP',
        images: [getTokenImg(BCT_ADDRESS, network), getTokenImg(USDC_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xb5af101742ecae095944f60c384d09453006bfde',
        symbol: 'KLIMA-USDC LP',
        images: [getAppImg(appId), getTokenImg(USDC_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xf9c3fc299de5f86d9cd6a724e6b44933720f5e6d',
        symbol: 'KLIMA-MC02 LP',
        images: [getAppImg(appId), getTokenImg(MC02_ADDRESS, network)],
      },
    ];

    return this.olympusContractPositionHelper.getPositions({
      appId: KLIMA_DEFINITION.id,
      network,
      groupId,
      depositories,
      mintedTokenAddress: klimaToken.address,
    });
  }
}
