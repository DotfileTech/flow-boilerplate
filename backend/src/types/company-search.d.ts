import { Address } from './address'

export type CompanySearch = {
  country: string;
  name: string;
  search_ref: string;
  registration_number: string;
  address: Address;
};