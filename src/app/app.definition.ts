import { Network } from '~types/network.interface';

import { AppDefinitionObject, AppGroup, AppLinks, AppAction, AppTag, PresentationConfig } from './app.interface';

export const appDefinition = <T extends AppDefinitionObject>(definition: T) => definition;

class AppDefinitionToken {
  address: string;
  network: Network;
}

class AppSupportedNetwork {
  readonly network: Network;
  readonly actions: AppAction[];
}

export class AppDefinition {
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
