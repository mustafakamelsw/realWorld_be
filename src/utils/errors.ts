export const getErrorMessage = (error: string, desc?: string) => {
  return {
    errors: error,
    description: desc ?? error,
  };
};
interface Error {
  field: string;
  message: string;
}
interface CustomError {
  description: string;
  errors: Error[];
}
export const getValidationErrorMessage = (
  t: Function,
  fields: Record<string, string | any[]>
) => {
  const customErrorMessage: CustomError = {
    description: t('userErrors_checkRequiredFields'),
    errors: [],
  };
  let errors: Error[] = [];
  Object.keys(fields).forEach((field) => {
    if (fields[field] === undefined) {
      errors.push({
        field,
        message: field + ' ' + t('COMMON_ERROR.fieldRequired'),
      });
    }
  });
  customErrorMessage.errors = errors;
  return customErrorMessage;
};
