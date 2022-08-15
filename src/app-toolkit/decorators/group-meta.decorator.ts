import { applyDecorators, SetMetadata } from '@nestjs/common';

export const BALANCE_PRESENTER_GROUP_LABEL = 'BALANCE_PRESENTER_GROUP_LABEL';

export const GroupMeta = (groupLabel: string) => {
  return applyDecorators(SetMetadata(BALANCE_PRESENTER_GROUP_LABEL, groupLabel));
};
