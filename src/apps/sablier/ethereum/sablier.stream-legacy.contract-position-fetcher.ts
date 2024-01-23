import { Inject, NotImplementedException } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { SablierStreamApiClient } from '../common/sablier.stream.api-client';
import { SablierViemContractFactory } from '../contracts';
import { SablierStream } from '../contracts/viem';

export type SablierStreamLegacyContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

export type SablierStreamLegacyContractPositionDefinition = {
  address: string;
  tokenAddress: string;
};

@PositionTemplate()
export class EthereumSablierStreamLegacyContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierStreamLegacyContractPositionDataProps,
  SablierStreamLegacyContractPositionDefinition
> {
  groupLabel = 'Streams (Legacy)';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SablierViemContractFactory) protected readonly contractFactory: SablierViemContractFactory,
    @Inject(SablierStreamApiClient) protected readonly apiClient: SablierStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    const tokens = await this.apiClient.getTokens();
    const streamAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    return tokens.map(v => ({ address: streamAddress, tokenAddress: v }));
  }

  getContract(address: string) {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SablierStream, SablierStreamLegacyContractPositionDefinition>) {
    return [
      {
        address: definition.tokenAddress,
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<SablierStream, SablierStreamLegacyContractPositionDataProps>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Sablier Stream`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const streams = await this.apiClient.getLegacyStreams(address, this.network);
    if (streams.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: this.appId },
    });

    const sablierAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    const sablierStreamContract = this.contractFactory.sablierStreamLegacy({
      address: sablierAddress,
      network: this.network,
    });
    const sablierStream = multicall.wrap(sablierStreamContract);

    const sablierSalaryAddress = '0xbd6a40bb904aea5a49c59050b5395f7484a4203d';
    const sablierSalaryContract = this.contractFactory.sablierSalary({
      address: sablierSalaryAddress,
      network: this.network,
    });
    const sablierSalary = multicall.wrap(sablierSalaryContract);

    const salaries = await Promise.all(
      streams.map(async stream =>
        sablierSalary.read.getSalary([BigInt(stream.salaryId)]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        }),
      ),
    );

    const underlyingAddresses = compact(salaries).map(stream => ({
      network: this.network,
      address: stream[3].toLowerCase(),
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      streams.map(async stream => {
        const salaryRaw = await sablierSalary.read.getSalary([BigInt(stream.salaryId)]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        });
        if (!salaryRaw) return null;

        const employeeAddress = salaryRaw[1].toLowerCase();
        const isRecipient = employeeAddress === address;
        const who = isRecipient ? address : sablierSalaryAddress;
        const salaryBalanceRaw = await sablierStream.read.balanceOf([BigInt(stream.streamId), who]);

        const tokenAddress = salaryRaw[3].toLowerCase();
        const token = tokenDependencies.find(t => t.address === tokenAddress);
        if (!token) return null;

        const remainingRaw = salaryRaw[6].toString();
        const depositRaw = salaryRaw[2].toString();
        const balanceRaw = salaryBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);

        const position: ContractPositionBalance<SablierStreamLegacyContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: sablierAddress,
          network: this.network,
          appId: this.appId,
          groupId: this.groupId,
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,

          dataProps: {
            deposited,
            remaining,
          },

          displayProps: {
            label: `${isRecipient ? 'Available' : 'Deposited'} ${token.symbol} on Sablier stream #${stream.streamId}`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
          },
        };

        position.key = this.appToolkit.getPositionKey(position);

        return position;
      }),
    );

    return compact(positions);
  }
}
