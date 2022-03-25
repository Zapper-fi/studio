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

export interface AbstractPosition<T = DefaultDataProps> extends Contract {
  tokens: WithMetaType<Token>[];
  dataProps: T;
  displayProps: DisplayProps;
  key?: string;
}

export interface ContractPosition<T = Record<string, unknown>> extends AbstractPosition<T> {
  type: ContractType.POSITION;
}

export interface AppToken<T = DefaultDataProps> extends AbstractToken, AbstractPosition<T> {
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

export type Token = BaseToken | AppToken | NonFungibleToken;
export type Position<T = DefaultDataProps> = ContractPosition<T> | AppToken<T>;
