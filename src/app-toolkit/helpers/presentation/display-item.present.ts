import {
  DollarDisplayItem,
  NumberDisplayItem,
  PercentageDisplayItem,
  StringDisplayItem,
  TranslationDisplayItem,
} from '~position/display.interface';

export const buildStringDisplayItem = (value: string): StringDisplayItem => ({ type: 'string', value });
export const buildNumberDisplayItem = (value: number): NumberDisplayItem => ({ type: 'number', value });
export const buildTranslatableDisplayItem = (value: string): TranslationDisplayItem => ({ type: 'translation', value });
export const buildDollarDisplayItem = (value: number): DollarDisplayItem => ({ type: 'dollar', value });
export const buildPercentageDisplayItem = (value: number): PercentageDisplayItem => ({ type: 'pct', value });
