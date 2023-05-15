import { CompanyStatusEnum } from '../constants/company-status.enum';
import { CheckInterface } from './check-interface';
import { BankingInformation } from './banking-information';
import { Address } from './address';
import { CompanyClassification } from './company-classification';

export type Company = {
  address: Address;
  banking_information: BankingInformation;
  checks: CheckInterface[];
  classifications?: CompanyClassification[];
  country: string;
  employer_identification_number?: string;
  id: string;
  legal_form?: string;
  name: string;
  registration_date?: string;
  registration_number: string;
  status: CompanyStatusEnum;
  tax_identification_number?: string;
  website_url?: string;
};
