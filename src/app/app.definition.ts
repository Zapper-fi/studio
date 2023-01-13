import { Network } from '~types/network.interface';

import { AppDefinitionObject, AppGroup, AppLinks, AppAction, AppTag, PresentationConfig } from './app.interface';

export const appDefinition = <T extends AppDefinitionObject>(definition: T) => definition;

function toSupported(supportedNetworks: Record<string, AppAction[]>): { network: Network; actions: AppAction[] }[] {
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
  readonly actions: AppAction[];
}

export class AppDefinition {
  constructor(definitionRaw: AppDefinitionObject) {
    this.id = definitionRaw.id;
    this.name = definitionRaw.name;
    this.description = definitionRaw.description ?? '';
    this.url = definitionRaw.url;
    this.links = definitionRaw.links;
    this.keywords = definitionRaw.keywords ?? [];
    this.tags = definitionRaw.tags;
    this.groups = definitionRaw.groups;
    this.presentationConfig = definitionRaw.presentationConfig;
    this.supportedNetworks = toSupported(definitionRaw.supportedNetworks ?? {});
    this.token = definitionRaw.token;
  }

  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly links: AppLinks;
  readonly keywords: string[];
  readonly tags: AppTag[];
  readonly groups?: Record<string, AppGroup>;
  readonly presentationConfig?: PresentationConfig;
  readonly supportedNetworks?: AppSupportedNetwork[];
  readonly token?: AppDefinitionToken;
}
