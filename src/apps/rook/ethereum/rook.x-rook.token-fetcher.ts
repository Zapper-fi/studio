import { Injectable } from '@nestjs/common';

import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { ROOK_DEFINITION } from '../rook.definition';

@Injectable()
export class EthereumRookXRookTokenFetcher extends VaultTokenFetcher {
  appId = ROOK_DEFINITION.id;
  groupId = ROOK_DEFINITION.groups.xRook.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'xROOK';

  vaultAddress = '0x8ac32f0a635a0896a8428a9c31fbf1ab06ecf489';
  underlyingTokenAddress = '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a';
  reserveAddress = '0x4f868c1aa37fcf307ab38d215382e88fca6275e2';
}
