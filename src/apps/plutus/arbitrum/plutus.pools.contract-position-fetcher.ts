import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlsJonesPlutusChef, PlsDpxPlutusChef, MasterChef } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.pools.id;
const network = Network.ARBITRUM_MAINNET;

const VAULTS = {
  DPX_VAULT: '0x20DF4953BA19c74B2A46B6873803F28Bf640c1B5'.toLowerCase(),
  JONES_VAULT: '0x23B87748b615096d1A0F48870daee203A720723D'.toLowerCase(),
  PLS_VAULT: '0x5593473e318F0314Eb2518239c474e183c4cBED5'.toLowerCase(),
}

export const ADDRESSES = {
  dpx: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'.toLowerCase(),
  rdpx: '0x32eb7902d4134bf98a28b963d26de779af92a212'.toLowerCase(),
  jones: '0x10393c20975cf177a3513071bc110f7962cd67da'.toLowerCase(),
  pls: '0x51318b7d00db7acc4026c88c3952b66278b6a67f'.toLowerCase(),
  plsDpx: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1'.toLowerCase(),
  plsJones: '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44'.toLowerCase(),
}


@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPoolsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) { }

  async getStakedDPXPosition() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlsDpxPlutusChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [PLUTUS_DEFINITION.groups.ve.id], network }],
      resolveFarmAddresses: async () => [VAULTS.DPX_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).plsDpx(),
      resolveFarmContract: opts => this.contractFactory.plsDpxPlutusChef(opts),
      resolveRewardTokenAddresses: async () => [
        ADDRESSES.pls, ADDRESSES.plsDpx, ADDRESSES.plsJones, ADDRESSES.dpx, ADDRESSES.rdpx
      ],
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }

  async getStakedJonesPosition() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlsJonesPlutusChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [PLUTUS_DEFINITION.groups.ve.id], network }],
      resolveFarmAddresses: async () => [VAULTS.JONES_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).plsJones(),
      resolveFarmContract: opts => this.contractFactory.plsJonesPlutusChef(opts),
      resolveRewardTokenAddresses: async () => [
        ADDRESSES.pls, ADDRESSES.plsDpx, ADDRESSES.plsJones, ADDRESSES.jones
      ],
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }

  async getStakedPLSPosition() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<MasterChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network },],
      resolveFarmAddresses: async () => [VAULTS.PLS_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).poolInfo(0).then(info => info.lpToken),
      resolveFarmContract: opts => this.contractFactory.masterChef(opts),
      resolveRewardTokenAddresses: async () => ADDRESSES.pls,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }

  async getPositions() {
    const dpx = await this.getStakedDPXPosition();
    const jones = await this.getStakedJonesPosition();
    const pls = await this.getStakedPLSPosition();
    return [
      ...dpx, ...jones, ...pls
    ];
  }
}
