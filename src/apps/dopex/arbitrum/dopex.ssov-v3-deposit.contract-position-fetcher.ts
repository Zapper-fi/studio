import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range } from 'lodash';
import { unix } from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { DopexSsovV3DefinitionsResolver } from '../common/dopex.ssov-v3.definition-resolver';
import { DopexContractFactory, DopexSsovV3 } from '../contracts';

@PositionTemplate()
export class ArbitrumDopexSsovV3DepositContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<DopexSsovV3> {
  groupLabel = 'SSOV V3 deposits';

  // accruedPremium and rewardTokenWithdrawAmounts are available on viewer
  ssovV3ViewerAddress = '0x535e6f0d70e8c6b1477946b03d14aa2d87680c52';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
    @Inject(DopexSsovV3DefinitionsResolver) protected readonly ssovDefinitionResolver: DopexSsovV3DefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexSsovV3 {
    return this.contractFactory.dopexSsovV3({ network: this.network, address });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const addresses = await this.ssovDefinitionResolver.getSsovV3Definitions(this.network);

    return addresses.map(address => {
      return {
        address,
      };
    });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<DopexSsovV3>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.collateralToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<DopexSsovV3>) {
    return contract.name();
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const ssovV3Contract = this.contractFactory.dopexSsovV3({
          address: contractPosition.address,
          network: this.network,
        });
        const numPositionsRaw = await multicall.wrap(ssovV3Contract).balanceOf(address);

        return await Promise.all(
          range(0, numPositionsRaw.toNumber()).map(async index => {
            const tokenId = await multicall.wrap(ssovV3Contract).tokenOfOwnerByIndex(address, index);

            const writePosition = await multicall.wrap(ssovV3Contract).writePosition(tokenId);
            const suppliedAmountRaw = writePosition.collateralAmount;

            const suppliedAmount = drillBalance(contractPosition.tokens[0], suppliedAmountRaw.toString());

            const strike = Number(writePosition.strike) / 10 ** 8;
            const epoch = Number(writePosition.epoch);
            const epochTimes = await multicall.wrap(ssovV3Contract).getEpochTimes(epoch);
            const epochEndDate = unix(Number(epochTimes.end)).format('MMMM D, yyyy');

            const dataProps = {
              ...contractPosition.dataProps,
              epoch,
              epochEndDate,
              strike,
            };

            contractPosition.dataProps = dataProps;

            return {
              ...contractPosition,
              tokens: [suppliedAmount],
              balanceUSD: suppliedAmount.balanceUSD,
            };
          }),
        );
      }),
    );

    return _.compact(balances.flat());
  }
}
