import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';
import getProxyForUrl from './getProxyForUrl.js';
import validateUrl from './urlValidator.js';

const createNewFeed = (feedData, url) => ({
  title: feedData.title,
  description: feedData.description,
  url,
  feedId: _.uniqueId('feed_'),
});

const createNewPosts = (postsData, feedId) => {
  const newPosts = postsData.map((postData) => ({
    title: postData.title,
    description: postData.description,
    url: postData.url,
    postId: _.uniqueId('post_'),
    feedId,
    viewed: false,
  }));

  return newPosts;
};

const handleFormSubmit = (event, watchedState) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get('url-input');
  const existingUrls = watchedState.rssData.feeds
    .map((feed) => feed.url);
  validateUrl(url, existingUrls)
    .then(() => {
      watchedState.processState = 'sending';
      const proxyForUrl = getProxyForUrl(url);
      const axiosPromise = axios.get(proxyForUrl);
      return Promise.resolve(axiosPromise);
    })
    .then((response) => parseRss(response.data.contents))
    .then((parsedData) => {
      watchedState.processState = 'finished';

      const newFeed = createNewFeed(parsedData.feedData, url);
      const oldFeeds = watchedState.rssData.feeds;
      watchedState.rssData.feeds = [newFeed, ...oldFeeds];

      const newPosts = createNewPosts(parsedData.postsData, newFeed.feedId);
      const oldPosts = watchedState.rssData.posts;
      watchedState.rssData.posts = [...newPosts, ...oldPosts];

      watchedState.processState = 'filling';
    })
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

export default handleFormSubmit;
