import { CompanyStatusEnum } from '../constants';
import { Address } from './address';
import { Classification } from './classification';
import { BankingInformation } from './banking-information';
import { Check } from './check';

type DocumentOrder = {
  id: string;
  document_type: any;
  status: any;
  file_id: string;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  case_id: string;
  name: string;
  commercial_name: string;
  registration_number: string;
  registration_date: string;
  status: CompanyStatusEnum;
  legal_form: string;
  country: string;
  address: Address;
  classifications: Classification[];
  banking_information: BankingInformation;
  tax_identification_number: string;
  website_url: string;
  employer_identification_number: string;
  document_orders: DocumentOrder[];
  checks: Check[];
  created_at: string;
  updated_at: string;
};

export type CompanyInput = {
  case_id: string;
  name: string;
  commercial_name: string;
  registration_number: string;
  registration_date: string;
  status: CompanyStatusEnum;
  legal_form: string;
  country: string;
  address: Address;
  classifications: Classification[];
  banking_information: BankingInformation;
  tax_identification_number: string;
  website_url: string;
  employer_identification_number: string;
};
