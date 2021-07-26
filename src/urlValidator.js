import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
});

export default (currentUrl, existingUrls) => {
  const schema1 = yup.string().required('emptyUrl').url();
  const schema2 = yup.mixed().notOneOf(existingUrls, 'duplicatedUrl');
  try {
    schema1.validateSync(currentUrl);
    schema2.validateSync(currentUrl);
    return null;
  } catch (e) {
    return e;
  }
};
