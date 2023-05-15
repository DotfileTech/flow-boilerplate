import * as Yup from 'yup';

export const optionalStringRule = Yup.string()
  .optional()
  .nullable()
  .default(null)
  .transform((v) => (v === '' ? null : v));

export const isRequiredField = (form: any, field: string, nested?: string) => {
  return form.filter((f: any) =>
    nested ? f.id === field && f.nested === nested : f.id === field
  )[0].required;
};

export const isEnabledField = (form: any, field: string, nested?: string) => {
  return form.filter((f: any) =>
    nested ? f.id === field && f.nested === nested : f.id === field
  )[0].enabled;
};
