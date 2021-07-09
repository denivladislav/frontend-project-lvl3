import _ from 'lodash';
import axios from 'axios';
import getProxy from './proxy.js';
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

const checkFeedUpdates = (watchedState) => {
  const { feeds } = watchedState.rssForm.rssData;
  feeds.forEach((feed) => {
    const proxy = getProxy();
    const { url } = feed;
    const axiosPromise = axios.get(proxy, { params: { url, disableCache: true } })
      .catch(() => {
        throw new Error('networkError');
      });
    return Promise.resolve(axiosPromise)
      .then((response) => parseRss(response.data.contents))
      .then((parsedData) => {
        const oldPosts = watchedState.rssForm.rssData.posts;
        const loadedPosts = parsedData.postsData;
        const diffPostsArray = _.differenceWith(loadedPosts, oldPosts,
          (a, b) => a.title === b.title);
        const newPosts = createNewPosts(diffPostsArray, feed.feedId);
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
  });
  setTimeout(() => checkFeedUpdates(watchedState), 5000);
};

export default checkFeedUpdates;
