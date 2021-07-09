import * as yup from 'yup';
import _ from 'lodash';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
});

const schema = yup.string()
  .required('emptyUrl')
  .url();

export default (currentUrl, existingUrls) => schema.validate(currentUrl)
  .then(() => {
    if (_.includes(existingUrls, currentUrl)) {
      throw new Error('duplicatedUrl');
    }
  });
