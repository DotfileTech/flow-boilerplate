export type CustomField = {
  /**
   * @description Should be unique because it's used as the field name and also as the translation key
   */
  id: string;

  /**
   * @description The field type is optional, if not specified it's an input text by default
   * @enum ['radio' | 'select' | 'date' | 'url' | 'country' | 'text' | 'number' | 'tel' | 'email']
   * @default 'text'
   */
  type?:
    | 'radio'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'url'
    | 'country'
    | 'text'
    | 'number'
    | 'tel'
    | 'email';

  /**
   * @description To set if the field is required or not
   */
  isRequired: boolean;

  /**
   * @description To display a helper (the text will be defined in the translations files)
   */
  hasHelper?: boolean;

  /**
   * @description When the field type is radio or select, you have to define the list of options
   */
  options?: string[];
};
