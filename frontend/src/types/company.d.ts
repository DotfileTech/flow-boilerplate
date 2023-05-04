import { CompanyStatusEnum } from '../constants/company-status.enum';
import { CheckInterface } from './check-interface';
import { BankingInformation } from './banking-information';
import { Address } from './address';
import { CompanyClassification } from './company-classification';

export type Company = {
  address: Address;
  banking_information: BankingInformation;
  case_id: string;
  checks: CheckInterface[];
  classifications?: CompanyClassification[];
  country: string;
  created_at: Date;
  employer_identification_number?: string;
  id: string;
  legal_form?: string;
  name: string;
  registration_date?: string;
  registration_number: string;
  status: CompanyStatusEnum;
  tax_identification_number?: string;
  updated_at: Date;
  website_url?: string;
};
