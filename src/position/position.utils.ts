import { WithMetaType } from './display.interface';
import { MetaType, Token } from './position.interface';

export const isWallet = (token: WithMetaType<Token>) => token.metaType === MetaType.WALLET;
export const isSupplied = (token: WithMetaType<Token>) => token.metaType === MetaType.SUPPLIED;
export const isBorrowed = (token: WithMetaType<Token>) => token.metaType === MetaType.BORROWED;
export const isClaimable = (token: WithMetaType<Token>) => token.metaType === MetaType.CLAIMABLE;
export const isVesting = (token: WithMetaType<Token>) => token.metaType === MetaType.VESTING;
export const isLocked = (token: WithMetaType<Token>) => token.metaType === MetaType.LOCKED;

export const metatyped = <T extends Token>(token: T, metaType: MetaType): WithMetaType<T> => ({ metaType, ...token });
export const wallet = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.WALLET, ...token });
export const supplied = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.SUPPLIED, ...token });
export const borrowed = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.BORROWED, ...token });
export const claimable = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.CLAIMABLE, ...token });
export const vesting = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.VESTING, ...token });
export const locked = <T extends Token>(token: T): WithMetaType<T> => ({ metaType: MetaType.LOCKED, ...token });
