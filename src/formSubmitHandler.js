import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';
import getProxyForUrl from './getProxyForUrl.js';
import validateUrl from './urlValidator.js';

const createNewFeed = (feedData, url) => ({
  title: feedData.title,
  description: feedData.description,
  url,
  id: _.uniqueId('feed_'),
});

const createNewPosts = (postsData, feedId) => {
  const newPosts = postsData.map((postData) => ({
    title: postData.title,
    description: postData.description,
    url: postData.url,
    id: _.uniqueId('post_'),
    feedId,
    viewed: false,
  }));

  return newPosts;
};

const getRss = (url, watchedState) => {
  watchedState.processState = 'sending';

  const proxyForUrl = getProxyForUrl(url);
  const axiosPromise = axios.get(proxyForUrl);
  return axiosPromise;
};

const updateState = (parsedData, watchedState, url) => {
  watchedState.processState = 'finished';

  const newFeed = createNewFeed(parsedData.feedData, url);
  const oldFeeds = watchedState.rssData.feeds;
  watchedState.rssData.feeds = [newFeed, ...oldFeeds];

  const newPosts = createNewPosts(parsedData.postsData, newFeed.id);
  const oldPosts = watchedState.rssData.posts;
  watchedState.rssData.posts = [...newPosts, ...oldPosts];
};

const handleFormSubmit = (event, watchedState) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get('url-input');
  const existingUrls = watchedState.rssData.feeds.map((feed) => feed.url);

  validateUrl(url, existingUrls)
    .then(() => getRss(url, watchedState))
    .then((response) => parseRss(response.data.contents))
    .then((parsedData) => updateState(parsedData, watchedState, url))
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

export default handleFormSubmit;
