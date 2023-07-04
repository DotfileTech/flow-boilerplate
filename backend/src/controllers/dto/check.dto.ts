import { Expose, Type } from 'class-transformer';
import { CheckStatusEnum, CheckTypeEnum } from '../../constants';
import { CustomDocumentTypeDTO } from './custom-document-type.dto';

class CheckDataReviewDTO {
  @Expose()
  comment: string;
}

class CheckDataSettingsDTO {
  @Expose()
  @Type(() => CustomDocumentTypeDTO)
  custom_document_type: CustomDocumentTypeDTO;
}

class CheckDataVendorDTO {
  @Expose()
  verification_url: string;
}

class CheckDataDTO {
  @Expose()
  @Type(() => CheckDataReviewDTO)
  review: CheckDataReviewDTO;

  @Expose()
  @Type(() => CheckDataSettingsDTO)
  settings: CheckDataSettingsDTO;

  @Expose()
  @Type(() => CheckDataVendorDTO)
  vendor: CheckDataVendorDTO;
}

export class CheckDTO {
  @Expose()
  id: string;

  @Expose()
  type: CheckTypeEnum;

  @Expose()
  status: CheckStatusEnum;

  @Expose()
  subtype: string;

  @Expose()
  @Type(() => CheckDataDTO)
  data: CheckDataDTO;
}
