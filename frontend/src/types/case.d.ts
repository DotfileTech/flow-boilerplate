import { Company } from './company';
import { Individual } from './individual';
import { CaseFlagEnum } from '../constants/case-flag.enum';

export type Case = {
  flags: CaseFlagEnum[];
  individuals: Individual[];
  companies: Company[];
};
