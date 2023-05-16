export type CompanyData = {
  /**
   * @description Should be unique because it's used as the field name and also as the translation key
   */
  id: string;

  /**
   * @description To set if the field is required or not
   */
  required: boolean;

  /**
   * @description It's optional and allow to group fields
   * @enum ['address' | 'banking_information' | 'classifications']
   */
  nested?: 'address' | 'banking_information' | 'classifications';

  /**
   * @description To display or not a field in the company edit form
   */
  enabled: boolean;

  /**
   * @description The field type is optional, if not specified it's an input text by default
   * @enum ['select' | 'date' | 'url' | 'country' | 'text' | 'number' | 'tel' | 'email']
   * @default 'text'
   */
  type?:
    | 'select'
    | 'date'
    | 'url'
    | 'country'
    | 'text'
    | 'number'
    | 'tel'
    | 'email';

  /**
   * @description To display a helper (the text will be defined in the translations files)
   */
  hasHelper?: boolean;

  /**
   * @description When the field type is a select, you have to define the list of options
   */
  options?: string[];
};
