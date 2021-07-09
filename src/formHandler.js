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

export default (watchedState) => function handler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url-input');
  const feedUrls = watchedState.rssForm.rssData.feeds
    .map((feed) => feed.url);

  validateUrl(url, feedUrls)
    .then(() => {
      watchedState.rssForm.processState = 'sending';
      const proxy = getProxy();
      const axiosPromise = axios.get(proxy, { params: { url, disableCache: true } })
        .catch(() => {
          throw new Error('networkError');
        });
      return Promise.resolve(axiosPromise);
    })
    .then((response) => parseRss(response.data.contents))
    .then((parsedData) => {
      watchedState.rssForm.processState = 'finished';
      watchedState.rssForm.currentFeedback = { type: 'successMessage' };
      const newFeed = createNewFeed(parsedData.feedData, url);
      const oldFeeds = watchedState.rssForm.rssData.feeds;
      if (oldFeeds) {
        watchedState.rssForm.rssData.feeds = [newFeed].concat(oldFeeds);
      } else watchedState.rssForm.rssData.feeds = [newFeed];

      const newPosts = createNewPosts(parsedData.postsData, newFeed.feedId);
      const oldPosts = watchedState.rssForm.rssData.posts;
      if (oldPosts) {
        watchedState.rssForm.rssData.posts = newPosts.concat(oldPosts);
      } else watchedState.rssForm.rssData.posts = newPosts;
    })
    .catch((error) => {
      watchedState.rssForm.processState = 'failed';
      watchedState.rssForm.currentFeedback = {
        type: 'errorMessage',
        tag: error.message,
      };
      watchedState.rssForm.processState = 'filling';
    });
};
