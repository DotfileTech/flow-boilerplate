import { Expose, Type } from 'class-transformer';
import { CheckDTO } from './check.dto';

export class CompanyDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  country: string;

  @Expose()
  registration_number: string;

  @Expose()
  @Type(() => CheckDTO)
  checks: CheckDTO[];
}
