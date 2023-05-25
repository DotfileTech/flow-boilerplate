import { Company } from './company';
import { Individual } from './individual';
import { CaseStatusEnum } from '../constants/case-status.enum';
import { CaseFlagEnum } from '../constants/case-flag.enum';

export type Case = {
  companies: Company[];
  id: string;
  individuals: Individual[];
  name: string;
  status: CaseStatusEnum;
  flags: CaseFlagEnum[];
};
