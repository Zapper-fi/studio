import { applyDecorators, SetMetadata } from '@nestjs/common';

import { SCHEDULER_INTERVAL, SCHEDULER_IS_SCHEDULED_OPERATION } from './scheduler.constants';

export type ScheduleOptions = {
  every: number;
};

export const Schedule = (options: ScheduleOptions) => {
  return applyDecorators(
    SetMetadata(SCHEDULER_IS_SCHEDULED_OPERATION, true),
    SetMetadata(SCHEDULER_INTERVAL, options.every),
  );
};
