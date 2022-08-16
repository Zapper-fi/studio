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
  ContractPositionFetcherContext,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { SablierStreamApiClient } from '../common/sablier.stream.api-client';
import { SablierContractFactory, SablierStream } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

export type SablierStreamContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

export type SablierStreamContractPositionDescriptor = {
  address: string;
  tokenAddress: string;
};

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.stream.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSablierStreamContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierStreamContractPositionDataProps,
  SablierStreamContractPositionDescriptor
> {
  appId = SABLIER_DEFINITION.id;
  groupId = SABLIER_DEFINITION.groups.stream.id;
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
    const streamAddress = '0xcd18eaa163733da39c232722cbc4e8940b1d8888';
    return tokens.map(v => ({ address: streamAddress, tokenAddress: v }));
  }

  getContract(address: string): SablierStream {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getTokenDescriptors({
    descriptor,
  }: ContractPositionFetcherContext<
    SablierStream,
    SablierStreamContractPositionDataProps,
    SablierStreamContractPositionDescriptor
  >) {
    return [{ address: descriptor.tokenAddress, metaType: MetaType.SUPPLIED }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<SablierStream, SablierStreamContractPositionDataProps>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Sablier Stream`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const streams = await this.apiClient.getStreams(address, network);
    if (streams.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const sablierAddress = '0xcd18eaa163733da39c232722cbc4e8940b1d8888';
    const sablierStreamContract = this.contractFactory.sablierStream({ address: sablierAddress, network });
    const sablierStream = multicall.wrap(sablierStreamContract);

    const maybeRawStreams = await Promise.all(
      streams.map(async ({ streamId }) => {
        const rawStream = await sablierStream.getStream(streamId).catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        });

        if (!rawStream) return null;
        return { ...rawStream, streamId };
      }),
    );

    const rawStreams = compact(maybeRawStreams);
    const underlyingAddresses = rawStreams.map(({ tokenAddress }) => ({
      network,
      address: tokenAddress.toLowerCase(),
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      rawStreams.map(async stream => {
        const streamBalanceRaw = await sablierStream.balanceOf(stream.streamId, address).catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        });
        if (!streamBalanceRaw) return null;

        const token = tokenDependencies.find(t => t.address === stream.tokenAddress.toLowerCase());
        if (!token) return null;

        const remainingRaw = stream.remainingBalance.toString();
        const depositRaw = stream.deposit.toString();
        const balanceRaw = streamBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);
        const isRecipient = stream.recipient.toLowerCase() === address;

        const position: ContractPositionBalance<SablierStreamContractPositionDataProps> = {
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
