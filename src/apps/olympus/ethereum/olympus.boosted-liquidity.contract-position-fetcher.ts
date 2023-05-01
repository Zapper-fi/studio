import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { OlympusBoostedLiquidityManager, OlympusContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumOlympusBleContractPositionFetcher extends ContractPositionTemplatePositionFetcher<OlympusBoostedLiquidityManager> {
  groupLabel = 'Boosted Liquidity Vaults';

  LIQUIDITY_REGISTRY_ADDRESS = '0x375e06c694b5e50af8be8fb03495a612ea3e2275';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) protected readonly olympusContractFactory: OlympusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): OlympusBoostedLiquidityManager {
    return this.olympusContractFactory.olympusBoostedLiquidityManager({ address: _address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const contract = this.olympusContractFactory.olympusLiquidityRegistry({
      address: this.LIQUIDITY_REGISTRY_ADDRESS,
      network: this.network,
    });
    const activeVaultsCount = (await contract.activeVaultCount()).toNumber();
    const countArray = Array(activeVaultsCount).fill(0);
    const addresses = await Promise.all(
      countArray.map(async (value, position) => {
        const address = await contract.activeVaults(position);
        return { address };
      }),
    );
    return addresses;
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<OlympusBoostedLiquidityManager, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const pairTokenAddress = await _params.contract.pairToken();
    const reserveTokenAddress = await _params.contract.ohm();
    const rewardTokens = await _params.contract.getRewardTokens();
    const rewardTokenMap = rewardTokens.map(token => {
      return { metaType: MetaType.CLAIMABLE, address: token, network: this.network };
    });
    /** Boosted Liquidity means the protocol providing 1/2 of the LP position.
     * We should track entire position exposure, but depositor will only be returned the pairToken upon exit.
     * Thus we track reserveToken as both supplied and borrowed  */
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: pairTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: reserveTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: reserveTokenAddress,
        network: this.network,
      },
      ...rewardTokenMap,
    ];
  }

  getLabel(
    _params: GetDisplayPropsParams<OlympusBoostedLiquidityManager, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return Promise.resolve(`${getLabelFromToken(_params.contractPosition.tokens[0])}-OHM`);
  }

  async getTokenBalancesPerPosition(
    _params: GetTokenBalancesParams<OlympusBoostedLiquidityManager, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const balance = await _params.contract.getUserPairShare(_params.address);
    const ohmPrice = (await _params.contract.getOhmTknPoolPrice()).div(1e9);
    const ohmBalance = balance.mul(ohmPrice).div(1e9);
    const rewardTokens = await _params.contract.getRewardTokens();
    const rewardBalances = await Promise.all(
      rewardTokens.map(async token => {
        const rewards = await _params.contract.getOutstandingRewards(_params.address);
        const rewardBalances =
          rewards.find(address => address.rewardToken === token)?.outstandingRewards || BigNumber.from('0');
        return rewardBalances;
      }),
    );
    return [balance, ohmBalance, ohmBalance, ...rewardBalances];
  }
}
