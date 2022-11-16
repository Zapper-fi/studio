import { applyDecorators, SetMetadata } from '@nestjs/common';

export const SCHEDULER_OPTIONS = 'SCHEDULER_OPTIONS';

export type ScheduleOptions = {
  every: number;
};

export const Schedule = (options: ScheduleOptions) => {
  return applyDecorators(SetMetadata(SCHEDULER_OPTIONS, options));
};
