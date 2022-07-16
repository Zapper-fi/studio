import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CronusFinanceContractFactory } from '../contracts';
import { CRONUS_FINANCE_DEFINITION } from '../cronus-finance.definition';

const crn = '0x1488346419ffc85c6d54e71be80a222971fb2240';
const farmAddresses = [
  '0xcfe952774e02816472c25ea0bbefdb42df52b671', // wevmos-crn lp staking
  '0xdf6f5bcb002d9c1516e6a197a370507b944ad1a6', // wevmos-usdc lp staking
  '0x43cfc66318187e93e66aaa9558f4b9318621c01e', // crn-usdc lp staking
];
const stakedTokens = [
  '0x28c98da13f22fe98a93d79442b3f81c7e9c5c3c0', // wevmos-crn
  '0xc3edbd08ebe51cb5e824ecd1df6aafaead3bee47', // wevmos-usdc
  '0x80ee8297c9fcf6bbe2f4d4c9b50831cb65d61bf0', // crn-usdc
];

const appId = CRONUS_FINANCE_DEFINITION.id;
const groupId = CRONUS_FINANCE_DEFINITION.groups.farm.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosCronusFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CronusFinanceContractFactory) private readonly cronusFinanceContractFactory: CronusFinanceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: CRONUS_FINANCE_DEFINITION.id,
      groupIds: [CRONUS_FINANCE_DEFINITION.groups.pool.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    const farmDefinitions = farmAddresses.map((farm, index) => ({
      address: farm,
      stakedTokenAddress: stakedTokens[index],
      rewardTokenAddress: crn,
    }));

    const tokens = await Promise.all(
      farmDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(v => v.address === stakedTokenAddress);
        const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
        if (!stakedToken || !rewardToken) return null;
        const tokens = [supplied(stakedToken), claimable(rewardToken)];
        const contract = this.cronusFinanceContractFactory.erc20({
          address: stakedToken.address,
          network,
        });
        const [balanceRaw] = await Promise.all([multicall.wrap(contract).balanceOf(address)]);
        const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;

        // As a label, we'll use the underlying label, and prefix it with 'Staked'
        const label = getLabelFromToken(stakedToken);
        // For images, we'll use the underlying token images as well
        const images = getImagesFromToken(stakedToken);
        // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        // Create the contract position object
        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
          network,
          tokens,
          dataProps: {
            totalValueLocked,
          },
          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return position;
      }),
    );

    return compact(tokens);
  }
}
