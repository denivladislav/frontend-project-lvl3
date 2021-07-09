import axios from 'axios';
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

export const validateUrl = (currentUrl, existingUrls) => schema.validate(currentUrl)
  .then(() => {
    if (_.includes(existingUrls, currentUrl)) {
      throw new Error('duplicateUrl');
    }
  });

export const getRssData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
  const axiosPromise = axios.get(proxy, { params: { url, disableCache: true } })
    .catch(() => {
      throw new Error('networkError');
    });
  return Promise.resolve(axiosPromise);
};
