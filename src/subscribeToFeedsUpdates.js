import _ from 'lodash';
import axios from 'axios';
import getProxyUrl from './getProxyUrl.js';
import parseFeedData from './rssParser.js';

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
        const newPosts = changedPosts.map((changedPost) => ({
          ...changedPost,
          id: _.uniqueId('post_'),
          feedId: feed.id,
        }));
        watchedState.rssData.posts = [...newPosts, ...oldPosts];
      })
      .catch((error) => console.error(error));
  });
  return Promise.all(promises);
};

const subscribeToFeedsUpdates = (state) => {
  setTimeout(() => updatePosts(state)
    .finally(() => {
      subscribeToFeedsUpdates(state);
    }), 5000);
};

export default subscribeToFeedsUpdates;
