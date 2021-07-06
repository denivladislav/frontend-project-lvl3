/* eslint-disable no-param-reassign */
import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import parseRss from './parser.js';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
});

const schema = yup.string()
  .required('emptyUrl')
  .url();

const validateFormUrl = (form) => schema.validate(form.currentUrl)
  .then(() => {
    const urlIds = _.keys(form.data);
    const existingUrls = urlIds.map((urlId) => form.data[urlId].url);
    if (_.includes(existingUrls, form.currentUrl)) {
      throw new Error('duplicateUrl');
    }
  });

let idNumber = -1;

const getUrlId = () => {
  idNumber += 1;
  return idNumber;
};

const getRssData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  const axiosPromise = axios.get(`${proxy}${url}`)
    .catch((error) => {
      console.log('AXIOSERROR', error);
      console.log('AXIOSERROR.MESSAGE', error.message);
      throw new Error('networkError');
    });
  return Promise.resolve(axiosPromise);
};

export const checkUpdates = (watchedState) => {
  console.log('Enter check updates');
  const { data } = watchedState.rssForm;
  const urlIds = _.keys(data);
  urlIds.forEach((urlId) => {
    const urlToCheck = data[urlId].url;
    getRssData(urlToCheck)
      .then((response) => parseRss(response.data))
      .then((parsedData) => {
        const existingPosts = data[urlId].posts;
        const existingPostsIds = _.keys(existingPosts);
        const existingPostsTitles = existingPostsIds
          .map((existingPostId) => existingPosts[existingPostId].titles);

        const loadedPosts = parsedData.posts;
        const loadedPostsIds = _.keys(loadedPosts);
        const loadedPostsTitles = loadedPostsIds
          .map((loadedPostId) => loadedPosts[loadedPostId].titles);

        const newPostsTitles = _.differenceWith(loadedPostsTitles, existingPostsTitles, _.isEqual);
        console.log('newPostsTitles', newPostsTitles);
        if (!_.isEmpty(newPostsTitles)) {
          let lastId = Number(_.last(existingPostsIds));
          const newPosts = {};
          newPostsTitles.forEach((newPostsTitle) => {
            loadedPostsIds.forEach((loadedPostsId) => {
              if (newPostsTitle === loadedPosts[loadedPostsId].title) {
                lastId += 1;
                const newPostId = lastId;
                const newPostDescription = loadedPosts[loadedPostsId].description;
                const newPostLink = loadedPosts[loadedPostsId].link;
                newPosts[newPostId] = {
                  title: newPostsTitle,
                  description: newPostDescription,
                  link: newPostLink,
                  viewed: false,
                  new: true,
                };
              }
            });
          });
          console.log('newPosts', newPosts);
          const oldData = watchedState.rssForm.data;
          const newData = _.cloneDeep(oldData);
          _.merge(newData.posts, newPosts);
          console.log('newData after merge', newData);
          watchedState.rssForm.data = newData;
        }
      });
  });
  setTimeout(() => checkUpdates(watchedState), 5000);
};

export const getFormHandler = (watchedState) => function handler(e) {
  e.preventDefault();
  const form = document.querySelector('.rss-form');
  const inputField = document.querySelector('#url-input');
  const formData = new FormData(e.target);
  const currentUrl = formData.get('url-input');
  watchedState.rssForm.currentUrl = currentUrl;
  validateFormUrl(watchedState.rssForm)
    .then(() => {
      watchedState.rssForm.processState = 'sending';
      return Promise.resolve(getRssData(currentUrl));
    })
    .then((response) => parseRss(response.data))
    .then((parsedData) => {
      watchedState.rssForm.processState = 'finished';
      watchedState.rssForm.valid = true;
      watchedState.rssForm.feedback = { type: 'successMessage' };
      console.log('parsedData', parsedData);

      const urlId = getUrlId();
      const newData = {};
      newData[urlId] = {
        url: currentUrl,
        feed: parsedData.feed,
        posts: parsedData.posts,
      };
      const oldData = watchedState.rssForm.data;
      watchedState.rssForm.data = { ...oldData, ...newData };

      console.log(watchedState.rssForm.data);
      form.reset();
    })
    .catch((error) => {
      console.log('ERROR', error);
      console.log('ERROR.MESSAGE', error.message);
      watchedState.rssForm.processState = 'finished';
      watchedState.rssForm.valid = false;
      watchedState.rssForm.feedback = {
        type: 'errorMessage',
        tag: error.message,
      };
    });
  inputField.focus();
};
