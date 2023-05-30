import { CompanyStatusEnum } from '../../constants/company-status.enum';
import { IndividualRoleEnum } from '../../constants';

export interface CompanyEditFormValues {
  name: string;
  commercial_name: string;
  registration_number: string;
  country: string;
  legal_form: string;
  status: CompanyStatusEnum;
  registration_date: string;
  address: {
    street_address: string;
    street_address_2: string;
    postal_code: string;
    city: string;
    country: string;
  };
  banking_information: {
    iban: string;
    bic: string;
  };
  tax_identification_number: string;
  employer_identification_number: string;
  classifications: {
    code: string;
  }[];
}

export interface IndividualEditFormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  maiden_name: string;
  email: string;
  roles: IndividualRoleEnum[];
  birth_date: string;
  birth_country: string;
  birth_place: string;
  address: {
    street_address: string;
    street_address_2: string;
    postal_code: string;
    city: string;
    country: string;
  };
  banking_information: {
    iban: string;
    bic: string;
  };
  tax_identification_number: string;
  social_security_number: string;
  phone_number: string;
  position: string;
  ownership_percentage: number | null;
}
