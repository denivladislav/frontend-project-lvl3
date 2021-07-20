import _ from 'lodash';
import axios from 'axios';
import getProxyForUrl from './getProxyForUrl.js';
import parseRss from './rssParser.js';

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

const updatePosts = (watchedState) => {
  const { feeds } = watchedState.rssData;
  const promises = feeds.map((feed) => {
    const { url } = feed;
    const proxyForUrl = getProxyForUrl(url);
    const promise = axios.get(proxyForUrl)
      .then((response) => parseRss(response.data.contents))
      .then((parsedData) => {
        const oldPosts = watchedState.rssData.posts;
        const loadedPosts = parsedData.postsData;
        const diffPostsArray = _.differenceWith(loadedPosts, oldPosts,
          (a, b) => a.title === b.title);
        const newPosts = createNewPosts(diffPostsArray, feed.id);
        watchedState.rssData.posts = [...newPosts, ...oldPosts];
      });
    return promise;
  });
  return Promise.all(promises)
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

const subscriptToFeedsUpdates = (state, delay) => {
  setTimeout(() => updatePosts(state)
    .finally(() => {
      subscriptToFeedsUpdates(state, delay);
    }), delay);
};

export default subscriptToFeedsUpdates;
