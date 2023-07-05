import { Expose, Type } from 'class-transformer';
import { CaseFlagEnum } from '../../constants';
import { CompanyDTO } from './company.dto';
import { IndividualDTO } from './individual.dto';

class CaseMetadataDTO {
  @Expose()
  locale: string;

  @Expose()
  email: string;
}

export class CaseDetailedDTO {
  @Expose()
  flags: CaseFlagEnum[];

  @Expose()
  @Type(() => IndividualDTO)
  individuals: IndividualDTO[];

  @Expose()
  @Type(() => CompanyDTO)
  companies: CompanyDTO[];

  @Expose()
  @Type(() => CaseMetadataDTO)
  metadata: CaseMetadataDTO;
}
