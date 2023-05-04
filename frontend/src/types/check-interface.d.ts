import { CheckStatusEnum, CheckTypeEnum } from '../constants';

export type CheckInterface = {
  company_id?: string;
  created_at: Date;
  id: string;
  individual_id?: string;
  status: CheckStatusEnum;
  subtype?: string;
  type: CheckTypeEnum;
  updated_at: Date;
  data: any;
};
