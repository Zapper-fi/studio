import { Inject } from '@nestjs/common';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { getAppImg, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { OlympusBondContractPositionHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HECTOR_DAO_DEFINITION } from '../hector-dao.definition';

const appId = HECTOR_DAO_DEFINITION.id;
const groupId = HECTOR_DAO_DEFINITION.groups.bond.id;
const network = Network.FANTOM_OPERA_MAINNET;

const DAI_ADDRESS = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
const USDC_ADDRESS = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
const MIM_ADDRESS = '0x82f0b8b456c1a451378467398982d4834b6829c1';
const FRAX_ADDRESS = '0xdc301622e621166bd8e82f2ca0a26c13ad0be355';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorDaoBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
  ) {}

  async getPositions() {
    const bondDepositories = [
      {
        depositoryAddress: '0x4099eb0e82ffa0048e4bf037a9743ca05ec561d7',
        symbol: 'DAI (1,1)',
        images: [getTokenImg(DAI_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x6c9b3a47a28a39fea65e99d97895e717df1706d0',
        symbol: 'DAI LP V2 (1,1)',
        images: [getTokenImg(DAI_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x5d05ef2654b9055895f21d7057095e2d7575f5a2',
        symbol: 'USDC (1,1)',

        images: [getTokenImg(USDC_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x3c57481f373be0196a26a7d0a8e29e8cedc63ba1',
        symbol: 'HEC / USDC LP (1,1)',
        images: [getAppImg(appId), getTokenImg(USDC_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xa4e87a25bc9058e4ec193151558c3c5d02cebe31',
        symbol: 'FRAX (1,1)',
        images: [getTokenImg(FRAX_ADDRESS)],
      },
      {
        depositoryAddress: '0xde02631d898acd1bb8ff928c0f0ffa0cf29ab374',
        symbol: 'HEC / FRAX LP (1,1)',
        images: [getAppImg(appId), getTokenImg(FRAX_ADDRESS, network)],
      },
      {
        depositoryAddress: '0xa695750b8439ab2afbd88310946c99747c5b3a2e',
        symbol: 'MIM (1,1)',
        images: [getTokenImg(MIM_ADDRESS, network)],
      },
      {
        depositoryAddress: '0x72de9f0e51ca520379a341318870836fdcaf03b9',
        symbol: 'FTM (1,1)',
        images: [getTokenImg(ZERO_ADDRESS, network)],
      },
    ];

    return this.olympusContractPositionHelper.getPositions({
      appId,
      network,
      groupId,
      depositories: bondDepositories,
      mintedTokenAddress: '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0',
    });
  }
}
