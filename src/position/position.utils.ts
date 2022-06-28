import { WithMetaType } from './display.interface';
import { MetaType, Token } from './position.interface';

export const isWallet = (token: WithMetaType<Token>) => token.metaType === MetaType.WALLET;
export const isSupplied = (token: WithMetaType<Token>) => token.metaType === MetaType.SUPPLIED;
export const isBorrowed = (token: WithMetaType<Token>) => token.metaType === MetaType.BORROWED;
export const isClaimable = (token: WithMetaType<Token>) => token.metaType === MetaType.CLAIMABLE;
export const isVesting = (token: WithMetaType<Token>) => token.metaType === MetaType.VESTING;
export const isLocked = (token: WithMetaType<Token>) => token.metaType === MetaType.LOCKED;

export const wallet = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.WALLET, ...token });
export const supplied = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.SUPPLIED, ...token });
export const borrowed = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.BORROWED, ...token });
export const claimable = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.CLAIMABLE, ...token });
export const vesting = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.VESTING, ...token });
export const locked = <T>(token: T): WithMetaType<T> => ({ metaType: MetaType.LOCKED, ...token });
