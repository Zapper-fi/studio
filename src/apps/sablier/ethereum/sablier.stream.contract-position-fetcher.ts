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

export type SablierStreamContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

export type SablierStreamContractPositionDefinition = {
  address: string;
  tokenAddress: string;
};

@PositionTemplate()
export class EthereumSablierStreamContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierStreamContractPositionDataProps,
  SablierStreamContractPositionDefinition
> {
  groupLabel = 'Streams';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SablierViemContractFactory) protected readonly contractFactory: SablierViemContractFactory,
    @Inject(SablierStreamApiClient) protected readonly apiClient: SablierStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    const tokens = await this.apiClient.getTokens();
    const streamAddress = '0xcd18eaa163733da39c232722cbc4e8940b1d8888';
    return tokens.map(v => ({ address: streamAddress, tokenAddress: v }));
  }

  getContract(address: string) {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SablierStream, SablierStreamContractPositionDefinition>) {
    return [
      {
        address: definition.tokenAddress,
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SablierStream, SablierStreamContractPositionDataProps>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Sablier Stream`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const streams = await this.apiClient.getStreams(address, this.network);
    if (streams.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: this.appId },
    });

    const sablierAddress = '0xcd18eaa163733da39c232722cbc4e8940b1d8888';
    const sablierStreamContract = this.contractFactory.sablierStream({
      address: sablierAddress,
      network: this.network,
    });
    const sablierStream = multicall.wrap(sablierStreamContract);

    const maybeRawStreams = await Promise.all(
      streams.map(async ({ streamId }) => {
        const rawStream = await sablierStream.read.getStream([BigInt(streamId)]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        });

        if (!rawStream) return null;
        return { ...rawStream, streamId };
      }),
    );

    const rawStreams = compact(maybeRawStreams);
    const underlyingAddresses = rawStreams.map(data => ({
      network: this.network,
      address: data[3].toLowerCase(),
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      rawStreams.map(async stream => {
        const tokenAddress = stream[3].toLowerCase();
        const remainingBalanceData = stream[6];
        const depositData = stream[2];
        const recipientAddress = stream[1].toLowerCase();

        const streamBalanceRaw = await sablierStream.read.balanceOf([BigInt(stream.streamId), address]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        });
        if (!streamBalanceRaw) return null;

        const token = tokenDependencies.find(t => t.address === tokenAddress.toLowerCase());
        if (!token) return null;

        const remainingRaw = remainingBalanceData.toString();
        const depositRaw = depositData.toString();
        const balanceRaw = streamBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);
        const isRecipient = recipientAddress === address;

        const position: ContractPositionBalance<SablierStreamContractPositionDataProps> = {
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
