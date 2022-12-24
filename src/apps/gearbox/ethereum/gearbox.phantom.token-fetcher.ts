import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';

import { GearboxContractFactory, PhantomToken } from '../contracts';

import { EthereumGearboxCreditAccountsContractPositionFetcher } from './gearbox.credit-accounts.contract-position-fetcher';

@PositionTemplate()
export class EthereumGearboxPhantomTokenFetcher extends AppTokenTemplatePositionFetcher<
  PhantomToken,
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxContractFactory) private readonly gearboxContractFactory: GearboxContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Phantom Tokens';

  async getAddresses(params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const creditAccountPositionFetcher = new EthereumGearboxCreditAccountsContractPositionFetcher(
      this.appToolkit,
      this.gearboxContractFactory,
    );

    const tokenLoader = this.appToolkit.getTokenDependencySelector();

    const creditManagerDefinitions = await creditAccountPositionFetcher.getDefinitions({
      multicall: this.appToolkit.getMulticall(this.network),
      tokenLoader: this.appToolkit.getTokenDependencySelector(),
    });

    const phantomTokens = (
      await Promise.all(
        creditManagerDefinitions.map(async manager => {
          const tokenDefinitions = await creditAccountPositionFetcher.getTokenDefinitions({
            multicall: this.appToolkit.getMulticall(this.network),
            tokenLoader: this.appToolkit.getTokenDependencySelector(),
            address: manager.address,
            contract: this.gearboxContractFactory.creditManagerV2({ address: manager.address, network: this.network }),
            definition: { address: manager.address },
          });

          if (tokenDefinitions === null) return [];

          const loaded = await tokenLoader.getMany(
            tokenDefinitions?.map(tokenDefinition => ({ address: tokenDefinition.address, network: this.network })),
          );

          // assuming unloaded tokens as phantom tokens
          return tokenDefinitions
            .filter((tokenDefinition, idx) => loaded[idx] === null)
            .map(tokenDefinition => tokenDefinition.address);
        }),
      )
    ).flat();

    return phantomTokens.filter((value, idx, self) => self.indexOf(value) === idx);
  }

  getContract(address: string): PhantomToken {
    return this.gearboxContractFactory.phantomToken({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions(
    params: GetUnderlyingTokensParams<PhantomToken, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    const underlying = await params.contract.underlying();
    return [{ address: underlying, network: this.network }];
  }
}
