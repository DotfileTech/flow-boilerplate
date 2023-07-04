import { Expose } from 'class-transformer';

export class CustomDocumentTypeDTO {
  @Expose()
  label: string;
}
