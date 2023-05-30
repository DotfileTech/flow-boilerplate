import { CompanyStatusEnum, IndividualRoleEnum } from '../constants';
import { Address } from './address';
import { Classification } from './classification';

type CompanyRepresentative = {
  entityType: 'company' | 'individual';
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  maiden_name: string;
  birth_date: string;
  birth_country: string;
  birth_place: string;
  legal_form: string;
  country: string;
  address: Address;
  position: string;
};

type BeneficialOwner = {
  ownership_percentage: number;
} & CompanyRepresentative;

type Shareholder = {
  ownership_percentage: number;
} & CompanyRepresentative;

type LegalRepresentative = CompanyRepresentative;

type MergedIndividual = {
  roles: IndividualRoleEnum[];
  ownership_percentage: number;
} & CompanyRepresentative;

export type CompanyData = {
  name: string;
  commercial_name: string;
  registration_number: string;
  country: string;
  status: CompanyStatusEnum;
  tax_identification_number: string;
  registration_date: string;
  legal_form: string;
  address: Address;
  classifications: Classification[];
  beneficial_owners: BeneficialOwner[];
  shareholders: Shareholder[];
  legal_representatives: LegalRepresentative[];
  merged_individuals: MergedIndividual[];
};
