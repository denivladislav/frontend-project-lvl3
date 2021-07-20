import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';
import getProxy from './proxy.js';
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
  validateUrl(url)
    .then(() => {
      const feedUrls = watchedState.rssData.feeds
        .map((feed) => feed.url);
      if (_.includes(feedUrls, url)) {
        const error = new Error();
        error.isDuplicatedUrlError = true;
        throw error;
      }
    })
    .then(() => {
      watchedState.processState = 'sending';
      const proxy = getProxy();
      const axiosPromise = axios.get(proxy, { params: { url, disableCache: true } });
      return Promise.resolve(axiosPromise);
    })
    .then((response) => parseRss(response.data.contents))
    .then((parsedData) => {
      watchedState.processState = 'finished';

      const newFeed = createNewFeed(parsedData.feedData, url);
      const oldFeeds = watchedState.rssData.feeds;
      if (oldFeeds) {
        watchedState.rssData.feeds = [newFeed].concat(oldFeeds);
      } else {
        watchedState.rssData.feeds = [newFeed];
      }

      const newPosts = createNewPosts(parsedData.postsData, newFeed.feedId);
      const oldPosts = watchedState.rssData.posts;
      if (oldPosts) {
        watchedState.rssData.posts = newPosts.concat(oldPosts);
      } else {
        watchedState.rssData.posts = newPosts;
      }

      watchedState.processState = 'filling';
    })
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
      watchedState.processState = 'filling';
    });
};

export default handleFormSubmit;
