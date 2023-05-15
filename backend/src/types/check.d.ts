import { CheckStatusEnum, CheckTypeEnum } from '../constants';

export type Check = {
  id: string;
  individual_id: string;
  company_id: string;
  status: CheckStatusEnum;
  type: CheckTypeEnum;
  subtype: string;
  created_at: string;
  updated_at: string;
};
