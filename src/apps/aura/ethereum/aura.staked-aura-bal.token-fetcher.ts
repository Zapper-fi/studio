import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { AuraContractFactory } from '../contracts';
import { AuraBalStakingToken } from '../contracts/ethers/AuraBalStakingToken';

@PositionTemplate()
export class EthereumAuraStakedAuraBalTokenFetcher extends AppTokenTemplatePositionFetcher<AuraBalStakingToken> {
  groupLabel = 'Staked Aura BAL';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) protected readonly contractFactory: AuraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraBalStakingToken {
    return this.contractFactory.auraBalStakingToken({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xfaa2ed111b4f580fcb85c48e6dc6782dc5fcd7a6'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AuraBalStakingToken>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<AuraBalStakingToken>) {
    const ratioRaw = await contract.convertToAssets(BigNumber.from((1e18).toString()));
    const ratio = Number(ratioRaw) / 10 ** appToken.decimals;
    return [ratio];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AuraBalStakingToken>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
