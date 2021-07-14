import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
});

const schema = yup.string()
  .required('emptyUrl')
  .url();

export default (currentUrl) => schema.validate(currentUrl)
  .catch((e) => {
    const error = new Error();
    error.isValidationError = true;
    error.message = e.message;
    throw error;
  });
