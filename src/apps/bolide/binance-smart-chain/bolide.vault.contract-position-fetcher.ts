import { Inject } from "@nestjs/common";

import { APP_TOOLKIT, IAppToolkit } from "~app-toolkit/app-toolkit.interface";
import { Register } from "~app-toolkit/decorators";
import { PositionFetcher } from "~position/position-fetcher.interface";
import { AppTokenPosition, ContractPosition, MetaType } from "~position/position.interface";
import { Network } from "~types/network.interface";

import { BOLIDE_DEFINITION } from "../bolide.definition";
import { BolideContractFactory } from "../contracts";
import Axios from "axios";
import { ContractType } from "~position/contract.interface";
import { getAppImg, getImagesFromToken, getLabelFromToken } from "~app-toolkit/helpers/presentation/image.present";
import { buildDollarDisplayItem } from "~app-toolkit/helpers/presentation/display-item.present";
import { claimable, supplied } from "~position/position.utils";
import { drillBalance } from "~app-toolkit";
import { IDLE_DEFINITION } from "~apps/idle";

const appId = BOLIDE_DEFINITION.id;
const groupId = BOLIDE_DEFINITION.groups.vault.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

export interface ContractDto {
  id: number;
  blockchainId: number;
  platform?: string;
  type: string;
  name: string;
  address: string;
  data?: {
    approvedTokens?: string[];
  };
}

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceBolideVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BolideContractFactory) private readonly bolideContractFactory: BolideContractFactory
  ) {
  }

  async getVaultBalance(vaultContractAddress: string, depositTokenAddress: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const depositTokenContract = multicall.wrap(
      this.appToolkit.globalContracts.erc20({
        network,
        address: depositTokenAddress
      })
    );

    return await Promise.all([depositTokenContract.balanceOf(vaultContractAddress)]);
  }

  async getPositionItem(address: string, vault: ContractDto, allTokens: AppTokenPosition<any>[]) {
    const multicall = this.appToolkit.getMulticall(network);

    const token = allTokens.find(v => v.address === address);
    if (!token) {
      return;
    }

    const contract = this.bolideContractFactory.erc20({ address, network });

    const balanceRaw = await multicall.wrap(contract).balanceOf(address);
    // const balanceRaw = await contract.balanceOf('0xf274fb52732c2f77ecb8fc424798062138fe6147');

    const vaultTokenBalance = {
      ...drillBalance(token, balanceRaw.toString()),
      metaType: MetaType.SUPPLIED,
    };
    const tokens = [vaultTokenBalance];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address,
      network,
      tokens,
      dataProps: { },
      displayProps: {
        label: vaultTokenBalance.symbol,
        images: [getAppImg(IDLE_DEFINITION.id)],
      },
    };

    return position;
  }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId, groupIds: [groupId], network });

    const allTokens = [...appTokens, ...baseTokens];

    const vaults = await this.getVaults();
    const farming = await this.getFarming();

    // console.log(vaults);
    // console.log(vaults[0].data?.approvedTokens);

    // console.log(farming);

    const positions: ContractPosition[] = [];

    for (const vault of vaults) {
      for (const tokenAddress of vault.data?.approvedTokens || []) {
        const position = await this.getPositionItem(tokenAddress, vault, allTokens as any);
        if (position) {
          positions.push(position);
          console.log(position.tokens);
        }
      }
    }

    return positions;
  }

  async getVaults(): Promise<ContractDto[]> {
    const vaults = await Axios.get<any[]>("http://localhost:3000/external/api/vaults").then(
      (v) => v.data
    );
    return vaults;
  }

  async getFarming(): Promise<ContractDto[]> {
    const farmingList = await Axios.get<any[]>("http://localhost:3000/external/api/farms").then(
      (v) => v.data
    );
    return farmingList;
  }
}
