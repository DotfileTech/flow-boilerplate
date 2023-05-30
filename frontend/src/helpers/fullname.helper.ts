import { Individual } from '../types';

export const fullNameHelper = (
  individual: Partial<
    Pick<Individual, 'first_name' | 'middle_name' | 'last_name' | 'maiden_name'>
  >
): string => {
  return `${individual.first_name} ${
    individual.middle_name ? `${individual.middle_name} ` : ''
  }${individual.last_name} ${
    individual.maiden_name ? `(born ${individual.maiden_name})` : ''
  }`;
};
