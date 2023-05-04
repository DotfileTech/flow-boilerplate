import { Company } from './company';
import { Individual } from './individual';

export type Case = {
  companies: Company[];
  id: string;
  individuals: Individual[];
  name: string;
  status: CaseStatusEnum;
};
