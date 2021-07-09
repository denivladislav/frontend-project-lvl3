import _ from 'lodash';
import parseRss from './parser.js';
import { getRssData } from './utils.js';

const checkFeedUpdates = (watchedState) => {
  const { feeds } = watchedState.rssForm.rssData;
  feeds.forEach((feed) => {
    getRssData(feed.url)
      .then((response) => parseRss(response))
      .then((parsedData) => {
        const oldPosts = watchedState.rssForm.rssData.posts;
        const loadedPosts = parsedData.posts;

        const diffPosts = _.differenceWith(loadedPosts, oldPosts,
          (a, b) => a.title === b.title);

        const newPosts = diffPosts.reduce((acc, newPost) => {
          newPost.feedId = feed.feedId;
          newPost.postId = _.uniqueId('post_');
          acc.push(newPost);
          return acc;
        }, []);

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
