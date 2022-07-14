import { Contract, ContractType } from './contract.interface';
import { DefaultDataProps, DisplayProps, WithMetaType } from './display.interface';
import { AbstractToken, BaseToken } from './token.interface';

export enum MetaType {
  WALLET = 'wallet',
  SUPPLIED = 'supplied',
  BORROWED = 'borrowed',
  CLAIMABLE = 'claimable',
  VESTING = 'vesting',
  LOCKED = 'locked',
  NFT = 'nft',
}

export enum Standard {
  ERC_20 = 'erc20',
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
}

export interface AbstractPosition<T = DefaultDataProps> extends Contract {
  tokens: WithMetaType<Token>[];
  dataProps: T;
  displayProps: DisplayProps;
  key?: string;
}

export interface ContractPosition<T = DefaultDataProps> extends AbstractPosition<T> {
  type: ContractType.POSITION;
}

export interface AppTokenPosition<T = DefaultDataProps> extends AbstractToken, AbstractPosition<T> {
  type: ContractType.APP_TOKEN;
  supply: number;
  pricePerShare: number | number[]; // @TODO Make strictly an array
}

export interface NonFungibleToken extends AbstractToken {
  type: ContractType.NON_FUNGIBLE_TOKEN;
  metaType?: MetaType;
  displayProps?: DisplayProps & {
    profileImage: string;
  };
  assets?: {
    tokenId: string;
    balance: number;
    assetImg: string;
    balanceUSD: number;
    assetName: string;
  }[];
  collection?: {
    id: string;
    floorPrice: number;
    floorPriceUSD: number;
    img: string;
    imgBanner: string;
    imgProfile: string;
    imgFeatured: string;
    description: string;
    socials: Record<string, string>;
    owners: number;
    items: number;
    volume24h: number;
    volume24hUSD: number;
  };
}

export type ExchangeableAppTokenDataProps = {
  exchangeable: boolean;
};

export type Token = BaseToken | AppTokenPosition | NonFungibleToken;
export type Position<T = DefaultDataProps> = ContractPosition<T> | AppTokenPosition<T>;

export const isBaseToken = (token: any): token is BaseToken => token.type === ContractType.BASE_TOKEN;
export const isAppToken = (token: any): token is AppTokenPosition => token.type === ContractType.APP_TOKEN;
export const isContractPosition = (token: any): token is ContractPosition => token.type === ContractType.POSITION;
export const isNonFungibleToken = (token: any): token is NonFungibleToken =>
  token.type === ContractType.NON_FUNGIBLE_TOKEN;
