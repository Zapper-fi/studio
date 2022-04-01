import { WithMetaType } from './display.interface';
import { MetaType, Token } from './position.interface';

export const isWallet = (token: WithMetaType<Token>) => token.metaType === MetaType.WALLET;
export const isSupplied = (token: WithMetaType<Token>) => token.metaType === MetaType.SUPPLIED;
export const isBorrowed = (token: WithMetaType<Token>) => token.metaType === MetaType.BORROWED;
export const isClaimable = (token: WithMetaType<Token>) => token.metaType === MetaType.CLAIMABLE;
export const isVesting = (token: WithMetaType<Token>) => token.metaType === MetaType.VESTING;
export const isLocked = (token: WithMetaType<Token>) => token.metaType === MetaType.LOCKED;

export const wallet = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.WALLET, ...token });
export const supplied = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.SUPPLIED, ...token });
export const borrowed = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.BORROWED, ...token });
export const claimable = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.CLAIMABLE, ...token });
export const vesting = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.VESTING, ...token });
export const locked = (token: Token): WithMetaType<Token> => ({ metaType: MetaType.LOCKED, ...token });
