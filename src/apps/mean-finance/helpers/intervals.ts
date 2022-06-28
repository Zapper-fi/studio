import moment from 'moment';

const toReadable = (left: number, frequency: number) => {
  const customDuration = moment.duration(frequency * 1000 * left, 'milliseconds');
  const asDays = customDuration.as('days');
  const asHours = customDuration.as('hours');
  const asMinutes = customDuration.as('minutes');

  if (asDays >= 1) {
    return `${asDays} days`;
  }

  if (asHours >= 1) {
    return `${asHours} hours`;
  }

  return `${asMinutes} minutes`;
};

const ONE_MINUTE = 60;
const FIVE_MINUTES = ONE_MINUTE * 5;
const FIFTEEN_MINUTES = FIVE_MINUTES * 3;
const THIRTY_MINUTES = FIFTEEN_MINUTES * 2;
const ONE_HOUR = THIRTY_MINUTES * 2;
const FOUR_HOURS = ONE_HOUR * 4;
const ONE_DAY = FOUR_HOURS * 6;
const ONE_WEEK = ONE_DAY * 7;

export const STRING_SWAP_INTERVALS = {
  [ONE_MINUTE]: (left: number) => `${toReadable(left, ONE_MINUTE)} (${left} swaps)`,
  [FIVE_MINUTES]: (left: number) => `${toReadable(left, FIVE_MINUTES)} (${left} swaps)`,
  [FIFTEEN_MINUTES]: (left: number) => `${toReadable(left, FIFTEEN_MINUTES)} (${left} swaps)`,
  [THIRTY_MINUTES]: (left: number) => `${toReadable(left, THIRTY_MINUTES)} (${left} swaps)`,
  [ONE_HOUR]: (left: number) => `${toReadable(left, ONE_HOUR)} (${left} swaps)`,
  [FOUR_HOURS]: (left: number) => `${toReadable(left, FOUR_HOURS)} (${left} swaps)`,
  [ONE_DAY]: (left: number) => `${toReadable(left, ONE_DAY)} (${left} swaps)`,
  [ONE_WEEK]: (left: number) => `${toReadable(left, ONE_WEEK)} (${left} swaps)`,
};
