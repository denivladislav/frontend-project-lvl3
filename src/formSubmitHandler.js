import axios from 'axios';
import _ from 'lodash';
import parseNewFeedData from './rssParser.js';
import getProxyUrl from './getProxyUrl.js';
import validateUrl from './urlValidator.js';

const addNewFeedData = (parsedData, watchedState, url) => {
  watchedState.processState = 'finished';

  const newFeed = {
    ...parsedData,
    url,
    id: _.uniqueId('feed_'),
  };
  const oldFeeds = watchedState.rssData.feeds;
  watchedState.rssData.feeds = [newFeed, ...oldFeeds];

  const newPosts = parsedData.items.map((item) => ({
    ...item,
    id: _.uniqueId('post_'),
    feedId: newFeed.id,
  }));
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

  const proxyUrl = getProxyUrl(url);
  axios.get(proxyUrl)
    .then((response) => parseNewFeedData(response.data.contents))
    .then((parsedData) => addNewFeedData(parsedData, watchedState, url))
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

export default handleFormSubmit;
