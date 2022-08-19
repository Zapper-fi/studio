import { Inject, NotImplementedException } from '@nestjs/common';
import { compact } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { SablierStreamApiClient } from '../common/sablier.stream.api-client';
import { SablierContractFactory, SablierStream } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

export type SablierStreamLegacyContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

export type SablierStreamLegacyContractPositionDescriptor = {
  address: string;
  tokenAddress: string;
};

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSablierStreamLegacyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierStreamLegacyContractPositionDataProps,
  SablierStreamLegacyContractPositionDescriptor
> {
  appId = SABLIER_DEFINITION.id;
  groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
  network = Network.ETHEREUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SablierContractFactory) protected readonly contractFactory: SablierContractFactory,
    @Inject(SablierStreamApiClient) protected readonly apiClient: SablierStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDescriptors() {
    const tokens = await this.apiClient.getTokens();
    const streamAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    return tokens.map(v => ({ address: streamAddress, tokenAddress: v }));
  }

  getContract(address: string): SablierStream {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getTokenDescriptors({
    descriptor,
  }: TokenStageParams<
    SablierStream,
    SablierStreamLegacyContractPositionDataProps,
    SablierStreamLegacyContractPositionDescriptor
  >) {
    return [{ address: descriptor.tokenAddress, metaType: MetaType.SUPPLIED }];
  }

  async getLabel({
    contractPosition,
  }: DisplayPropsStageParams<SablierStream, SablierStreamLegacyContractPositionDataProps>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Sablier Stream`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const streams = await this.apiClient.getLegacyStreams(address, network);
    if (streams.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const sablierAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    const sablierStreamContract = this.contractFactory.sablierStreamLegacy({ address: sablierAddress, network });
    const sablierStream = multicall.wrap(sablierStreamContract);

    const sablierSalaryAddress = '0xbd6a40bb904aea5a49c59050b5395f7484a4203d';
    const sablierSalaryContract = this.contractFactory.sablierSalary({ address: sablierSalaryAddress, network });
    const sablierSalary = multicall.wrap(sablierSalaryContract);

    const salaries = await Promise.all(
      streams.map(async stream =>
        sablierSalary.getSalary(stream.salaryId).catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        }),
      ),
    );

    const underlyingAddresses = compact(salaries).map(({ tokenAddress }) => ({
      network,
      address: tokenAddress.toLowerCase(),
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      streams.map(async stream => {
        const salaryRaw = await sablierSalary.getSalary(stream.salaryId).catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        });
        if (!salaryRaw) return null;

        const isRecipient = salaryRaw.employee.toLowerCase() === address;
        const who = isRecipient ? address : sablierSalaryAddress;
        const salaryBalanceRaw = await sablierStream.balanceOf(stream.streamId, who);

        const tokenAddress = salaryRaw.tokenAddress.toLowerCase();
        const token = tokenDependencies.find(t => t.address === tokenAddress);
        if (!token) return null;

        const remainingRaw = salaryRaw.remainingBalance.toString();
        const depositRaw = salaryRaw.salary.toString();
        const balanceRaw = salaryBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);

        const position: ContractPositionBalance<SablierStreamLegacyContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: sablierAddress,
          network,
          appId,
          groupId,
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,

          dataProps: {
            deposited,
            remaining,
          },

          displayProps: {
            label: `${isRecipient ? 'Available' : 'Deposited'} ${token.symbol} on Sablier`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
