import * as yup from 'yup';

// This function creates the dynamic Yup schema
export function createYupSchema(schema: any, config: any) {
  const { id, validationType, validations = [] } = config;

  if (!(yup as any)[validationType]) {
    return schema;
  }

  let validator = (yup as any)[validationType]();

  validations.forEach((validation: any) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });

  schema[id] = validator;
  return schema;
}
