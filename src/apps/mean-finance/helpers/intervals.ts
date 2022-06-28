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
  [ONE_MINUTE]: {
    plural: (left: number) => `${toReadable(left, ONE_MINUTE)} (${left} swaps)`,
    adverb: 'every 1 minute',
  },
  [FIVE_MINUTES]: {
    plural: (left: number) => `${toReadable(left, FIVE_MINUTES)} (${left} swaps)`,
    adverb: 'every 5 minutes',
  },
  [FIFTEEN_MINUTES]: {
    plural: (left: number) => `${toReadable(left, FIFTEEN_MINUTES)} (${left} swaps)`,
    adverb: 'every 15 minutes',
  },
  [THIRTY_MINUTES]: {
    plural: (left: number) => `${toReadable(left, THIRTY_MINUTES)} (${left} swaps)`,
    adverb: 'every 30 minutes',
  },
  [ONE_HOUR]: {
    plural: (left: number) => `${toReadable(left, ONE_HOUR)} (${left} swaps)`,
    adverb: 'every hour',
  },
  [FOUR_HOURS]: {
    plural: (left: number) => `${toReadable(left, FOUR_HOURS)} (${left} swaps)`,
    adverb: 'every 4 hours',
  },
  [ONE_DAY]: {
    plural: (left: number) => `${toReadable(left, ONE_DAY)} (${left} swaps)`,
    adverb: 'every day',
  },
  [ONE_WEEK]: {
    plural: (left: number) => `${toReadable(left, ONE_WEEK)} (${left} swaps)`,
    adverb: 'every week',
  },
};
