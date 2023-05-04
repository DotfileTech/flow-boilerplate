import { IndividualRoleEnum } from '../constants';
import { CheckInterface } from './check-interface';
import { BankingInformation } from './banking-information';
import { Address } from './address';

export type Individual = {
  address: Address;
  banking_information: BankingInformation;
  birth_country?: string;
  birth_date?: string;
  birth_place?: string;
  case_id: string;
  checks: CheckInterface[];
  created_at: Date;
  email?: string;
  first_name: string;
  id: string;
  last_name: string;
  ownership_percentage?: number;
  phone_number?: string;
  position?: string;
  roles: IndividualRoleEnum[];
  social_security_number?: string;
  tax_identification_number?: string;
  updated_at: Date;
};
