import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied, claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { HelioContractFactory } from '../contracts';
import { HELIO_DEFINITION } from '../helio.definition';

const appId = HELIO_DEFINITION.id;
const groupId = HELIO_DEFINITION.groups.staking.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;
const HAY_TOKEN = '0x0782b6d8c4551b9760e74c0545a9bcd90bdc41e5';
const HAY_JAR = '0x0a1fd12f73432928c190caf0810b3b767a59717e';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainHelioStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HelioContractFactory) private readonly helioContractFactory: HelioContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const hayToken = baseTokens.find(v => v.address.toLowerCase() === HAY_TOKEN);
    if (!hayToken) return [];

    const multicall = this.appToolkit.getMulticall(network);

    const tokens = [supplied(hayToken), claimable(hayToken)];
    const contract = this.helioContractFactory.helioHay({
      address: HAY_TOKEN,
      network,
    });
    const balanceRaw = await Promise.all([multicall.wrap(contract).balanceOf(HAY_JAR)]);
    const totalValueLocked = Number(balanceRaw) / 10 ** hayToken.decimals;

    const label = `Staked ${getLabelFromToken(hayToken)}`;
    const images = getImagesFromToken(hayToken);
    const secondaryLabel = buildDollarDisplayItem(hayToken.price);

    // Create the contract position object
    const position: ContractPosition<DefaultDataProps> = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: HAY_JAR,
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

    return [position];
  }
}
