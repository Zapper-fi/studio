import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3AirdropContractPositionFetcher } from '../common/pool-together-v3.airdrop.contract-position-fetcher';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

@Injectable()
export class EthereumPoolTogetherV3AirdropTokenFetcher extends PoolTogetherV3AirdropContractPositionFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.airdrop.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Airdrops';
  isExcludedFromExplore = true;

  merkleAddress = '0xbe1a33519f586a4c8aa37525163df8d67997016f';
  airdropTokenAddress = '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'; // POOL
  airdropDataUrl = 'https://merkle.pooltogether.com/.netlify/functions/merkleAddressData';
}
