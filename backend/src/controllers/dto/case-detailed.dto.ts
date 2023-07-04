import { Expose, Type } from 'class-transformer';
import { CaseFlagEnum } from '../../constants';
import { CompanyDTO } from './company.dto';
import { IndividualDTO } from './individual.dto';

export class CaseDetailedDTO {
  @Expose()
  flags: CaseFlagEnum[];

  @Expose()
  @Type(() => IndividualDTO)
  individuals: IndividualDTO[];

  @Expose()
  @Type(() => CompanyDTO)
  companies: CompanyDTO[];
}
