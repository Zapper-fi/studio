import { applyDecorators, SetMetadata } from '@nestjs/common';

export const BALANCE_PRODUCT_META_SELECTOR = 'BALANCE_PRODUCT_META_SELECTOR';

export const BalanceProductMeta = (groupSelector: string) => {
  return applyDecorators(SetMetadata(BALANCE_PRODUCT_META_SELECTOR, groupSelector));
};
