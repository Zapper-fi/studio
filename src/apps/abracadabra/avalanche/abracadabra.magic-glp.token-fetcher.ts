import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HOURS_PER_YEAR } from '../common/abracadabra.common.constants';
import { AbracadabraMagicGlpTokenFetcher } from '../common/abracadabra.magic-glp.token-fetcher';

@PositionTemplate()
export class AvalancheAbracadabraMagicGlpTokenFetcher extends AbracadabraMagicGlpTokenFetcher {
  vaultAddress = '0x5efc10c353fa30c5758037fdf0a233e971ecc2e0';
  rewardTrackerAddresses = ['0xd2d1162512f927a7e282ef43a362659e4f2a728f', '0x9e295b5b976a184b14ad8cd72413ad846c299660'];
  magicGlpHarvestorAddress = '0x05b3b96df07b4630373ae7506e51777b547335b0';
  magicGlpAnnualHarvests = HOURS_PER_YEAR;
}
