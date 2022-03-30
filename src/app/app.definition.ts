import { validate as validateBtc } from 'bitcoin-address-validation';
import { uniq, keys, mapValues, zipObject } from 'lodash';

import { Network } from '~types/network.interface';

import { AddressFormat, AppDefinitionObject, ProtocolAction, ProtocolTag } from './app.interface';

function toNetworkWithActionsArray(
  supportedNetworks: Record<string, ProtocolAction[]>,
): { network: Network; actions: ProtocolAction[] }[] {
  return Object.keys(supportedNetworks).map((network: Network) => ({
    network,
    actions: supportedNetworks[network],
  }));
}

class AppDefinitionToken {
  address: string;
  network: Network;
}

class AppSupportedNetwork {
  readonly network: Network;
  readonly actions: ProtocolAction[];
}

export class AppDefinition {
  constructor(definitionRaw: AppDefinitionObject) {
    const specifiedNetworks = uniq([
      ...keys(definitionRaw.supportedNetworks),
      ...keys(definitionRaw.compatibleAddressFormat),
    ]);

    this.id = definitionRaw.id;
    this.tags = definitionRaw.tags;
    this.name = definitionRaw.name;
    this.url = definitionRaw.url;
    this.description = definitionRaw.description ?? '';
    this.groups = definitionRaw.groups;
    this.supportedNetworks = toNetworkWithActionsArray(definitionRaw.supportedNetworks);
    this.primaryColor = definitionRaw.primaryColor;
    this.token = definitionRaw.token ?? null;
    this.compatibleAddressFormats = mapValues(
      zipObject(specifiedNetworks, specifiedNetworks),
      (_, network) => definitionRaw.compatibleAddressFormat?.[network] ?? AddressFormat.EVM,
    );
  }

  static getAddressFormat(address: string) {
    if (validateBtc(address)) {
      return AddressFormat.BITCOIN;
    }
    return AddressFormat.EVM;
  }

  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly groups: Record<string, string>;
  readonly url: string;
  readonly deprecated?: boolean;
  readonly tags: ProtocolTag[];
  readonly supportedNetworks: AppSupportedNetwork[];
  readonly compatibleAddressFormats?: { [N in Network]?: AddressFormat };
  readonly primaryColor: string;
  readonly token: AppDefinitionToken | null;
}
