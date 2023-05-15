import { CaseFlagEnum, CaseStatusEnum } from '../constants';

export type CaseMetadata = {
  [key: string]: string;
};

export type Case = {
  id: string;
  name: string;
  status: CaseStatusEnum;
  external_id: string;
  template_id: string;
  flags: CaseFlagEnum[];
  tags: string[];
  metadata: CaseMetadata;
  created_at: string;
  updated_at: string;
};
