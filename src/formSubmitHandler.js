import axios from 'axios';
import _ from 'lodash';
import parseFeedData from './rssParser.js';
import getProxyUrl from './getProxyUrl.js';
import validateUrl from './urlValidator.js';

const createNewFeed = (data, url) => ({
  ...data,
  url,
  id: _.uniqueId('feed_'),
});

const createNewPosts = (data, feedId) => data.items.map((item) => ({
  ...item,
  id: _.uniqueId('post_'),
  feedId,
}));

const getFeedData = (url) => {
  const proxyUrl = getProxyUrl(url);
  return axios.get(proxyUrl);
};

const updateState = (parsedData, watchedState, url) => {
  watchedState.processState = 'finished';

  const newFeed = createNewFeed(parsedData, url);
  const oldFeeds = watchedState.rssData.feeds;
  watchedState.rssData.feeds = [newFeed, ...oldFeeds];

  const newPosts = createNewPosts(parsedData, newFeed.id);
  const oldPosts = watchedState.rssData.posts;
  watchedState.rssData.posts = [...newPosts, ...oldPosts];
};

const handleFormSubmit = (event, watchedState) => {
  event.preventDefault();
  watchedState.processState = 'sending';
  const formData = new FormData(event.target);
  const url = formData.get('url-input');
  const existingUrls = watchedState.rssData.feeds.map((feed) => feed.url);

  const validationError = validateUrl(url, existingUrls);
  if (validationError) {
    watchedState.processState = 'failed';
    watchedState.error = validationError;
    return;
  }

  getFeedData(url)
    .then((response) => parseFeedData(response.data.contents))
    .then((parsedData) => updateState(parsedData, watchedState, url))
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

export default handleFormSubmit;
