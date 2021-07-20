import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
});

export default (currentUrl, existingUrls) => {
  const schema1 = yup.string().required('emptyUrl').url();
  const schema2 = yup.mixed().notOneOf(existingUrls, 'duplicatedUrl');

  return schema1.validate(currentUrl)
    .then(() => schema2.validate(currentUrl));
};
