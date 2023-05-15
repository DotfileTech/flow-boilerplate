import { Case } from './case';
import { Company } from './company';
import { Individual } from './individual';

export type CaseDetailed = {
  individuals: Individual[];
  companies: Company[];
} & Case;
