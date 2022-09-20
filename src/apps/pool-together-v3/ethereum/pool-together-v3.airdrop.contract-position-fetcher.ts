import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3AirdropContractPositionFetcher } from '../common/pool-together-v3.airdrop.contract-position-fetcher';

@PositionTemplate()
export class EthereumPoolTogetherV3AirdropTokenFetcher extends PoolTogetherV3AirdropContractPositionFetcher {
  groupLabel = 'Airdrops';
  isExcludedFromExplore = true;

  merkleAddress = '0xbe1a33519f586a4c8aa37525163df8d67997016f';
  airdropTokenAddress = '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'; // POOL
  airdropDataUrl = 'https://merkle.pooltogether.com/.netlify/functions/merkleAddressData';
}
