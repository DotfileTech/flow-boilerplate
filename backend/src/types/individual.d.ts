import { IndividualRoleEnum } from '../constants';
import { BankingInformation } from './banking-information';
import { Address } from './address';
import { Check } from './check';

export type Individual = {
  id: string;
  case_id: string;
  roles: IndividualRoleEnum[];
  first_name: string;
  middle_name: string;
  last_name: string;
  maiden_name: string;
  email: string;
  birth_date: string;
  birth_country: string;
  birth_place: string;
  address: Address;
  banking_information: BankingInformation;
  tax_identification_number: string;
  social_security_number: string;
  phone_number: string;
  position: string;
  ownership_percentage: number;
  checks: Check[];
  created_at: string;
  updated_at: string;
};

export type IndividualInput = {
  case_id: string;
  roles: IndividualRoleEnum[];
  first_name: string;
  middle_name: string;
  last_name: string;
  maiden_name: string;
  email: string;
  birth_date: string;
  birth_country: string;
  birth_place: string;
  address: Address;
  banking_information: BankingInformation;
  tax_identification_number: string;
  social_security_number: string;
  phone_number: string;
  position: string;
  ownership_percentage: number;
};
