import { Expose, Type } from 'class-transformer';
import { IndividualRoleEnum } from '../../constants';
import { CheckDTO } from './check.dto';

export class IndividualDTO {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  roles: IndividualRoleEnum[];

  @Expose()
  @Type(() => CheckDTO)
  checks: CheckDTO[];
}
