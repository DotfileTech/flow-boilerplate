export type IndividualData = {
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
   * @enum ['address' | 'banking_information']
   */
  nested?: 'address' | 'banking_information';

  /**
   * @description To display or not a field in the individual edit form
   */
  enabled: boolean;

  /**
   * @description The field type is optional, if not specified it's an input text by default
   * @enum ['checkbox' | 'date' | 'url' | 'country' | 'text' | 'number' | 'tel' | 'email']
   * @default 'text'
   */
  type?:
    | 'checkbox'
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
   * @description When the field type is checkbox, you have to define the list of options
   */
  options?: string[];
};
