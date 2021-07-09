import _ from 'lodash';
import parseRss from './parser.js';
import { validateUrl, getRssData } from './utils.js';

export default (watchedState) => function handler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const currentUrl = formData.get('url-input');
  const { rssForm } = watchedState;
  const existingUrls = rssForm.rssData.feeds.map((feed) => feed.url);
  validateUrl(currentUrl, existingUrls)
    .then(() => {
      rssForm.processState = 'sending';
      return Promise.resolve(getRssData(currentUrl));
    })
    .then((response) => parseRss(response))
    .then((parsedRssData) => {
      rssForm.processState = 'finished';
      rssForm.currentFeedback = { type: 'successMessage' };

      const oldFeeds = rssForm.rssData.feeds;
      const newFeed = parsedRssData.feed;
      const newFeedId = _.uniqueId('feed_');
      newFeed.feedId = newFeedId;
      if (oldFeeds) {
        rssForm.rssData.feeds = [newFeed].concat(oldFeeds);
      } else rssForm.rssData.feeds = [newFeed];

      const oldPosts = rssForm.rssData.posts;
      const newPosts = parsedRssData.posts.reduce((acc, newPost) => {
        newPost.feedId = newFeedId;
        newPost.postId = _.uniqueId('post_');
        acc.push(newPost);
        return acc;
      }, []);
      if (oldPosts) {
        rssForm.rssData.posts = newPosts.concat(oldPosts);
      } else rssForm.rssData.posts = newPosts;
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
