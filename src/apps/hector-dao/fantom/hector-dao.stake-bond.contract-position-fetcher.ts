import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getAppImg, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { OlympusBondContractPositionHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HECTOR_DAO_DEFINITION } from '../hector-dao.definition';

const appId = HECTOR_DAO_DEFINITION.id;
const groupId = HECTOR_DAO_DEFINITION.groups.stakeBond.id;
const network = Network.FANTOM_OPERA_MAINNET;

const DAI_ADDRESS = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
const USDC_ADDRESS = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
const MIM_ADDRESS = '0x82f0b8b456c1a451378467398982d4834b6829c1';
const FRAX_ADDRESS = '0xdc301622e621166bd8e82f2ca0a26c13ad0be355';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorDaoStakeBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
  ) {}

  async getPositions() {
    const stakeBondDepositories = [
      {
        depositoryAddress: '0x23337b675375507ce218df5f92f1a71252dab3e5',
        symbol: 'DAI (4,4)',
        images: [getTokenImg(DAI_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xd0373f236be04ecf08f51fc4e3ade7159d7cde65',
        symbol: 'USDC (4,4)',
        images: [getTokenImg(USDC_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x8565f642180fe388f942460b66aba9c2ca7f02ed',
        symbol: 'MIM (4,4)',
        images: [getTokenImg(MIM_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xc798e6a22996c554739df607b7ef1d6d435fdbd9',
        symbol: 'FRAX (4,4)',
        images: [getTokenImg(FRAX_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x09eb3b10a13dd705c17ced39c35aeea0d419d0bb',
        symbol: 'HEX / FRAX LP (4,4)',
        images: [getAppImg(appId), getTokenImg(FRAX_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xff40f40e376030394b154dadcb4173277633b405',
        symbol: 'HEC / DAI LP (4,4)',
        images: [getAppImg(appId), getTokenImg(DAI_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xff6508aba1dad81aacf3894374f291f82dc024a8',
        symbol: 'HEC /USDC LP (4,4)',
        images: [getAppImg(appId), getTokenImg(USDC_ADDRESS, network)],
      },
    ];

    return this.olympusContractPositionHelper.getPositions({
      appId,
      network,
      groupId,
      depositories: stakeBondDepositories,
      dependencies: [
        {
          appId,
          network,
          groupIds: [HECTOR_DAO_DEFINITION.groups.vault.id],
        },
      ],
      mintedTokenAddress: '0x75bdef24285013387a47775828bec90b91ca9a5f',
    });
  }
}
