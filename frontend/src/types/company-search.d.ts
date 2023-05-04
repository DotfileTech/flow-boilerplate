import { Address } from './address';

export type CompanySearch = {
  country: string;
  name: string;
  registration_number: string;
  search_ref: string;
  address?: Address;
};
