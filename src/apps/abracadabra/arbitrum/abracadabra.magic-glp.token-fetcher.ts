import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMagicGlpTokenFetcher } from '../common/abracadabra.magic-glp.token-fetcher';

import {
  ARBITRUM_GLP_TOKEN_ADDRESS,
  GLP_REWARD_TRACKER_ADDRESSES,
  MAGIC_GLP_ADDRESS,
  MAGIC_GLP_ANNUAL_HARVESTS,
  MAGIC_GLP_HARVESTOR_ADDRESS,
} from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraMagicGlpTokenFetcher extends AbracadabraMagicGlpTokenFetcher {
  vaultAddress = MAGIC_GLP_ADDRESS;
  rewardTrackerAddresses = GLP_REWARD_TRACKER_ADDRESSES;
  magicGlpHarvestorAddress = MAGIC_GLP_HARVESTOR_ADDRESS;
  magicGlpAnnualHarvests = MAGIC_GLP_ANNUAL_HARVESTS;
  glpTokenAddress = ARBITRUM_GLP_TOKEN_ADDRESS;
}
