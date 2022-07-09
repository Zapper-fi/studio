import { Injectable } from '@nestjs/common';
import murmur from 'murmurhash-js';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';
import { AppTokenPosition, ContractPosition, MetaType, NonFungibleToken } from './position.interface';
import { BaseToken } from './token.interface';

export type AppGroupsDefinition = {
  appId: string;
  groupIds: string[];
  network: Network;
};

@Injectable()
export class PositionKeyService {
  generateKey(input: string) {
    return murmur.murmur3(input).toString();
  }

  getPositionKey(
    position: ContractPosition | AppTokenPosition | BaseToken | NonFungibleToken,
    pickFields: string[] = [],
  ) {
    if ('key' in position) return position.key!;

    switch (position.type) {
      case ContractType.POSITION:
        return this.generateKey(
          [
            position.address,
            position.network,
            position.appId,
            position.tokens.map(token => [token.address, token.network, token.metaType].join(':')),
            pickFields.map(v => position.dataProps[v]).join(':'),
          ].join(':'),
        );
      case ContractType.APP_TOKEN:
        return this.generateKey(
          [
            position.appId,
            position.address,
            position.network,
            MetaType.SUPPLIED,
            pickFields.map(v => position.dataProps[v]).join(':'),
          ].join(':'),
        );
      default:
        return this.generateKey([position.address, position.network, MetaType.SUPPLIED].join(':'));
    }
  }
}
