import { MetaType } from './position.interface';

//  DISPLAY PROPS
export type TranslationDisplayItem = {
  type: 'translation';
  value: string;
};

export type StringDisplayItem = {
  type: 'string';
  value: string;
};

export type NumberDisplayItem = {
  type: 'number';
  value: number;
};

export type DollarDisplayItem = {
  type: 'dollar';
  value: number;
};

export type PercentageDisplayItem = {
  type: 'pct';
  value: number;
};

export type InterpolationDisplayItem = {
  type: 'interpolation';
  value: {
    source: string;
    substitutions: Record<string, AnyDisplayItem>;
  };
};

export type AnyDisplayItem =
  | InterpolationDisplayItem
  | StringDisplayItem
  | NumberDisplayItem
  | TranslationDisplayItem
  | DollarDisplayItem
  | PercentageDisplayItem;

export type StatsItem = {
  label: string | TranslationDisplayItem;
  value: string | number | AnyDisplayItem;
};

export enum BalanceDisplayMode {
  DEFAULT = 'default',
  UNDERLYING = 'underlying',
}

export interface DisplayProps {
  label: string;
  labelDetailed?: string;
  secondaryLabel?: string | number | AnyDisplayItem;
  tertiaryLabel?: string | number | AnyDisplayItem;
  images: string[];
  appName?: string;
  statsItems?: StatsItem[];
  balanceDisplayMode?: BalanceDisplayMode;
}

export type DefaultDataProps = Record<string, unknown>;

export type WithMetaType<T> = T & {
  metaType?: MetaType;
};
