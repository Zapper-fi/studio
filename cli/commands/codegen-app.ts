import { Command } from '@oclif/core';
import dedent from 'dedent';
import fse from 'fs-extra';

import * as appsDefinitionsRegistry from '../imports/apps-definition-registry';
import { strings } from '../strings';

export enum GroupType {
  TOKEN = 'token',
  POSITION = 'position',
}

export type AppGroup = {
  id: string;
  type: GroupType;
};

enum Network {
  ETHEREUM_MAINNET = 'ethereum',
  POLYGON_MAINNET = 'polygon',
  OPTIMISM_MAINNET = 'optimism',
  GNOSIS_MAINNET = 'gnosis',
  BINANCE_SMART_CHAIN_MAINNET = 'binance-smart-chain',
  FANTOM_OPERA_MAINNET = 'fantom',
  AVALANCHE_MAINNET = 'avalanche',
  ARBITRUM_MAINNET = 'arbitrum',
  CELO_MAINNET = 'celo',
  HARMONY_MAINNET = 'harmony',
  MOONRIVER_MAINNET = 'moonriver',
  BITCOIN_MAINNET = 'bitcoin',
}

export default class CodegenApp extends Command {
  static description = '';
  static examples = [`$ ./agora codegen-app appId`];
  static flags = {};
  static args = [{ name: 'appId', description: 'The application id ', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(CodegenApp);

    const appId = args.appId;
    const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
    const networksRaw = appsDefinitionsRegistry[appDefinitionName].supportedNetworks;

    const networks = Object.keys(networksRaw);
    const groups = appsDefinitionsRegistry[appDefinitionName].groups;

    for (const network of networks) {
      for (const [id, type] of Object.entries<AppGroup>(groups)) {
        switch (type.type) {
          case 'token':
            generateTokenFetcher(appId, id, type.id, network);
            break;
          case 'position':
            generateContractPosition(appId, id, type.id, network);
            break;
          default:
        }
      }
    }
    this.log(`Files for ${appId} were generated !`);
  }
}

function generateTokenFetcher(appId: string, groupdId: string, groupdValue: string, networkRaw: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appTitleCase = strings.titleCase(appId);
  const appCamelCase = strings.camelCase(appTitleCase);

  const groupTitleCase = strings.titleCase(groupdValue);

  const network = Object.keys(Network as Record<string, unknown>).filter(k => networkRaw.includes(Network[k]));
  const networkTitleCase = strings.titleCase(networkRaw);

  const generatedContent = dedent`
  import { Inject } from '@nestjs/common';

  import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
  import { Register } from '~app-toolkit/decorators';
  //import { buildDollarDisplayItem, buildNumberDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
  //import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
  //import { ContractType } from '~position/contract.interface';
  import { PositionFetcher } from '~position/position-fetcher.interface';
  import { AppTokenPosition } from '~position/position.interface';
  import { Network } from '~types/network.interface';
  
  //import { UnagiiContractFactory } from '../contracts';
  import { ${appDefinitionName} } from '../${appId}.definition';
  
  const appId = ${appDefinitionName}.id;
  const groupId = ${appDefinitionName}.groups.${groupdId}.id;
  const network = Network.${network};
  
  @Register.TokenPositionFetcher({ appId, groupId, network })
  export class ${networkTitleCase}${appTitleCase}${groupTitleCase}TokenFetcher implements PositionFetcher<AppTokenPosition> {
    constructor(
      @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit, //@Inject(UnagiiContractFactory) private readonly ${appCamelCase}ContractFactory: ${appTitleCase}ContractFactory,
    ) {}
  
    async getPositions() {
      //onst multicall = this.appToolkit.getMulticall(network);
  
      // Underlying token
      /*const underlyingTokenAddress = '0x0000000000000000000000000000000000000000'.toLowerCase();
      const underlyingToken = await this.appToolkit.getBaseTokenPrice({
        network,
        address: underlyingTokenAddress,
      });
      if (!underlyingToken) return null;*/
  
      // Call on contract
      /* const tokenContract = this.${appCamelCase}ContractFactory.erc20({ address: tokenAddressRaw, network });
      const [totalSupplyRaw, decimalsRaw, symbol] = await Promise.all([
        multicall.wrap(tokenContract).totalSupply(),
        multicall.wrap(tokenContract).decimals(),
        multicall.wrap(tokenContract).symbol(),
      ]); */
  
      // Determine total supply
      /*const underlyingPrice = underlyingToken.price;
      const totalSupply = Number(totalSupplyRaw) / 10 ** Number(decimalsRaw);
      const underlyingAssets = Number(totalAssetsRaw) / 10 ** underlyingToken.decimals;*/
  
      // Determine the price per share
      /*const pricePerShare = underlyingAssets / totalSupply;
      const price = pricePerShare * underlyingToken.price;
  
      const reserve = totalSupply * pricePerShare;
      const liquidity = reserve * underlyingPrice;
  
      const tokens = [{ ...underlyingToken, reserve }];
      const secondaryLabel = symbol;*/
  
      /*const displayProps = {
        label: symbol,
        secondaryLabel: '',
        images: [
          //getTokenImg(underlyingToken.address)
        ],
        statsItems: [
          // Here you can add additionnal metrics like liquidity or totalSupply
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
        ],
      };*/
  
      /*const dataProps = {};*/
  
      /*const token: AppTokenPosition = {
        address,
        type: ContractType.APP_TOKEN,
        network,
        appId: ${appDefinitionName}.id,
        groupId: ${appDefinitionName}.groups.${groupdId}.id,
        symbol,
        decimals,
        supply,
        price,
        pricePerShare,
        tokens,
        dataProps,
        displayProps,
      };
      return [token];*/
      return [];
    }
  }

`;
  fse.writeFileSync(
    `./src/apps/${appId}/${networkRaw}/${appId}.${groupdValue}.token-fetcher.ts`,
    `${generatedContent}\n`,
  );
}

function generateContractPosition(appId: string, groupId: string, groupdValue: string, networkRaw: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appTitleCase = strings.titleCase(appId);

  const groupTitleCase = strings.titleCase(groupdValue);

  const network = Object.keys(Network as Record<string, unknown>).filter(k => networkRaw.includes(Network[k]));
  const networkTitleCase = strings.titleCase(networkRaw);

  const generatedContent = dedent`
  import { Inject } from '@nestjs/common';

  import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
  import { Register } from '~app-toolkit/decorators';
  //import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
  //import { ContractType } from '~position/contract.interface';
  import { PositionFetcher } from '~position/position-fetcher.interface';
  import { ContractPosition } from '~position/position.interface';
  import { Network } from '~types/network.interface';
  
  import { ${appDefinitionName} } from '../${appId}.definition';
  
  const appId = ${appDefinitionName}.id;
  const groupId = ${appDefinitionName}.groups.${groupId}.id;
  const network = Network.${network};
  
  @Register.ContractPositionFetcher({ appId, groupId, network })
  export class ${networkTitleCase}${appTitleCase}${groupTitleCase}ContractPositionFetcher implements PositionFetcher<ContractPosition> {
    constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}
  
    async getPositions() {
      /*const appTokens = await this.appToolkit.getAppTokenPositions({
        appId: ${appDefinitionName}.id,
        groupIds: [${appDefinitionName}.groups.token],
        network,
      });*/
  
      /*const positions = appTokens.map(token => {
        const position = {
          address: token.address,
          type: ContractType.POSITION,
          network,
          appId,
          groupId,
          tokens: [token],
  
          dataProps: {},
  
          displayProps: {
            label: token.symbol,
            images: token.displayProps.images,
            secondaryLabel: buildDollarDisplayItem(token.price),
          },
        };
        return position;
      });
  
      return positions;*/
      return [];
    }
  }
  

`;
  fse.writeFileSync(
    `./src/apps/${appId}/${networkRaw}/${appId}.${groupId}.contract-position-fetcher.ts`,
    `${generatedContent}\n`,
  );
}
