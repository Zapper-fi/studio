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
import { range } from 'lodash';

const appId = AURORA_PLUS_DEFINITION.id;
const groupId = AURORA_PLUS_DEFINITION.groups.stake.id;
const network = Network.AURORA_MAINNET;

const AURORA_ADDRESS = "0x8bec47865ade3b172a928df8f990bc7f2a3b9f79".toLowerCase();
const AURORA_STAKING_ADDRESS = "0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec".toLowerCase();

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
    let tokens:any = [];
    const aurora = baseTokens.find(t => t.address === AURORA_ADDRESS)!;
    if (!aurora) tokens.push(supplied(aurora));

    const multicall = this.appToolkit.getMulticall(network);
    const staking = this.auroraPlusContractFactory.staking({ address: AURORA_STAKING_ADDRESS, network });
    const mcs = multicall.wrap(staking);
    const streamCount = await staking.getStreamsCount();
    const streamIDs = range(0, streamCount.toNumber());
    const rewardTokenAddresses = await Promise.all(streamIDs.map((streamID:number) => mcs.getStream(streamID).then(r => r.rewardToken.toLowerCase())));
    const rewardTokens = rewardTokenAddresses.map((addr:string) => baseTokens.find(t => t.address === addr));
    rewardTokens.forEach(token => { if(!!token) tokens.push(claimable(token))});

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: AURORA_STAKING_ADDRESS,
      appId,
      groupId,
      network,
      tokens: tokens,
      dataProps: {},
      displayProps: {
        label: `Staked Aurora`,
        images: getImagesFromToken(aurora),
      },
    };
    return [position];
  }
}
