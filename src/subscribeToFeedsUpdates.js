import _ from 'lodash';
import axios from 'axios';
import getProxyUrl from './getProxyUrl.js';
import parseFeedData from './rssParser.js';

const createNewPosts = (data, feedId) => data.map((item) => ({
  ...item,
  id: _.uniqueId('post_'),
  feedId,
  viewed: false,
}));

const updatePosts = (watchedState) => {
  const { feeds } = watchedState.rssData;
  const promises = feeds.map((feed) => {
    const { url } = feed;
    const proxyUrl = getProxyUrl(url);
    return axios.get(proxyUrl)
      .then((response) => parseFeedData(response.data.contents))
      .then((parsedData) => {
        const oldPosts = watchedState.rssData.posts;
        const loadedPosts = parsedData.items;
        const diffPostsArray = _.differenceWith(loadedPosts, oldPosts,
          (a, b) => a.title === b.title);
        const newPosts = createNewPosts(diffPostsArray, feed.id);
        watchedState.rssData.posts = [...newPosts, ...oldPosts];
      });
  });
  return Promise.all(promises)
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    });
};

const subscribeToFeedsUpdates = (state, delay) => {
  setTimeout(() => updatePosts(state)
    .finally(() => {
      subscribeToFeedsUpdates(state, delay);
    }), delay);
};

export default subscribeToFeedsUpdates;
