import _ from 'lodash';
import axios from 'axios';
import getProxyForUrl from './getProxyForUrl.js';
import parseRss from './rssParser.js';

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

const checkFeedUpdates = (watchedState, delay) => {
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
        const newPosts = createNewPosts(diffPostsArray, feed.feedId);
        if (oldPosts) {
          watchedState.rssData.posts = newPosts.concat(oldPosts);
        } else {
          watchedState.rssData.posts = newPosts;
        }
      });
    return promise;
  });
  Promise.all(promises)
    .catch((error) => {
      watchedState.processState = 'failed';
      watchedState.error = error;
    })
    .finally(() => {
      setTimeout(() => checkFeedUpdates(watchedState, delay), delay);
    });
};

export default checkFeedUpdates;
