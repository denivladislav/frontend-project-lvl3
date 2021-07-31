import _ from 'lodash';
import axios from 'axios';
import getProxyUrl from './getProxyUrl.js';
import parseFeedData from './rssParser.js';

const createNewPosts = (data, feedId) => data.map((item) => ({
  ...item,
  id: _.uniqueId('post_'),
  feedId,
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
        const changedPosts = _.differenceWith(loadedPosts, oldPosts,
          (a, b) => a.title === b.title);
        const newPosts = createNewPosts(changedPosts, feed.id);
        watchedState.rssData.posts = [...newPosts, ...oldPosts];
      })
      .catch((error) => console.error(error));
  });
  return Promise.all(promises);
};

const subscribeToFeedsUpdates = (state, delay) => {
  setTimeout(() => updatePosts(state)
    .finally(() => {
      subscribeToFeedsUpdates(state, delay);
    }), delay);
};

export default subscribeToFeedsUpdates;
