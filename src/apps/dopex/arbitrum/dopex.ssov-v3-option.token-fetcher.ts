import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { DopexSsovV3DefinitionsResolver } from '../common/dopex.ssov-v3.definition-resolver';
import { DopexContractFactory, DopexOptionToken } from '../contracts';

export type SsovV3OptionAppTokenDefinition = {
  address: string;
  collateralTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumDopexSsovV3OptionTokenFetcher extends AppTokenTemplatePositionFetcher<
  DopexOptionToken,
  DefaultAppTokenDataProps,
  SsovV3OptionAppTokenDefinition
> {
  groupLabel = 'SSOV V3 options';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
    @Inject(DopexSsovV3DefinitionsResolver) protected readonly ssovDefinitionResolver: DopexSsovV3DefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexOptionToken {
    return this.contractFactory.dopexOptionToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<SsovV3OptionAppTokenDefinition[]> {
    const addresses = await this.ssovDefinitionResolver.getSsovV3Definitions(this.network);

    const optionDefinitions = await Promise.all(
      addresses.map(async address => {
        const ssovV3Contract = this.contractFactory.dopexSsovV3({ address, network: this.network });
        const [epoch, collateralTokenAddressRaw] = await Promise.all([
          multicall.wrap(ssovV3Contract).currentEpoch(),
          multicall.wrap(ssovV3Contract).collateralToken(),
        ]);
        const epochData = await multicall.wrap(ssovV3Contract).getEpochData(epoch);

        const strikesRaw = epochData.strikes;

        return await Promise.all(
          strikesRaw.map(async strike => {
            const epochStrikeDate = await multicall.wrap(ssovV3Contract).getEpochStrikeData(epoch, strike);
            const strikeTokenAddress = epochStrikeDate.strikeToken.toLowerCase();
            const collateralTokenAddress = collateralTokenAddressRaw.toLowerCase();

            const strikeToken = this.contractFactory.dopexOptionToken({
              address: strikeTokenAddress,
              network: this.network,
            });
            const isExpired = await multicall.wrap(strikeToken).hasExpired();
            if (isExpired) return null;

            return { address: strikeTokenAddress, collateralTokenAddress };
          }),
        );
      }),
    );

    return compact(optionDefinitions.flat());
  }

  getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>): string[] | Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<DopexOptionToken, SsovV3OptionAppTokenDefinition>) {
    return [{ address: definition.collateralTokenAddress, network: this.network }];
  }

  async getLabel({ appToken, contract }: GetDisplayPropsParams<DopexOptionToken>) {
    const [isPut, strikeRaw] = await Promise.all([contract.isPut(), contract.strike()]);
    const optionType = isPut ? 'PUT' : 'CALL';
    const strike = Number(strikeRaw) / 10 ** 8;
    return `${optionType} - ${getLabelFromToken(appToken.tokens[0])} - ${strike}$`;
  }

  async getPrice({ appToken, contract }: GetPriceParams<DopexOptionToken>): Promise<number> {
    const optionValueRaw = await contract.optionValue();
    return Number(optionValueRaw) / 10 ** appToken.decimals;
  }

  async getPricePerShare() {
    return [1];
  }
}
