import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { ContractType } from '~position/contract.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AURORA_PLUS_DEFINITION } from '../aurora-plus.definition';
import { AuroraPlusContractFactory } from '../contracts';

const appId = AURORA_PLUS_DEFINITION.id;
const groupId = AURORA_PLUS_DEFINITION.groups.stake.id;
const network = Network.AURORA_MAINNET;

const AURORA_ADDRESS = "0x8bec47865ade3b172a928df8f990bc7f2a3b9f79".toLowerCase();
const AURORA_STAKING_ADDRESS = "0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec".toLowerCase();
const BASTION_ADDRESS = "0x9f1f933c660a1dc856f0e0fe058435879c5ccef0".toLowerCase();
const AURIGAMI_ADDRESS = "0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f".toLowerCase();
const USN_ADDRESS = "0x5183e1b1091804bc2602586919e6880ac1cf2896".toLowerCase();
const TRISOLARIS_ADDRESS = "0xfa94348467f64d5a457f75f8bc40495d33c65abb".toLowerCase();


@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraAuroraPlusStakeContractPositionFetcher implements PositionFetcher<ContractPosition>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(AuroraPlusContractFactory)
    private readonly auroraPlusContractFactory: AuroraPlusContractFactory,
  ) { }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const aurora = baseTokens.find(t => t.address === AURORA_ADDRESS)!;
    const bastion = baseTokens.find(t => t.address === BASTION_ADDRESS)!;
    const aurigami = baseTokens.find(t => t.address === AURIGAMI_ADDRESS)!;
    const usn = baseTokens.find(t => t.address === USN_ADDRESS)!;
    const trisolaris = baseTokens.find(t => t.address === TRISOLARIS_ADDRESS)!;

    // console.log(aurora, bastion, aurigami, usn, trisolaris);
    if (!aurora) return [];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: AURORA_STAKING_ADDRESS,
      appId,
      groupId,
      network,
      tokens: [supplied(aurora), claimable(aurora), claimable(bastion), claimable(aurigami), claimable(usn), claimable(trisolaris)],
      dataProps: {},
      displayProps: {
        label: `Staked Aurora`,
        images: getImagesFromToken(aurora),
      },
    };
    return [position];
  }
}
