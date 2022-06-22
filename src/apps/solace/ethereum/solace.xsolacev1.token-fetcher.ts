import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Token } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.xsolacev1.id;
const network = Network.ETHEREUM_MAINNET;

const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';
const XSOLACE_V1_ADDRESS = '0x501ace5ac3af20f49d53242b6d208f3b91cfc411';
const symbol = 'xSOLACEv1';
const decimals = 18;
const ONE_ETHER = '1000000000000000000';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSolaceXsolacev1TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const solace = baseTokens.find((t: WithMetaType<Token>) => t.address === SOLACE_ADDRESS)!;
    const xsolacev1 = this.solaceContractFactory.xSolacev1({ address: XSOLACE_V1_ADDRESS, network });
    const mcxs = multicall.wrap(xsolacev1);
    const [supplyRaw, pricePerShareRaw] = await Promise.all([mcxs.totalSupply(), mcxs.xSolaceToSolace(ONE_ETHER)]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;
    const price = solace.price * pricePerShare;
    const tokens = [solace];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: XSOLACE_V1_ADDRESS,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,
      dataProps: {},
      displayProps: {
        label: symbol,
        images: getImagesFromToken(solace),
      },
    };

    return [token];
  }
}
