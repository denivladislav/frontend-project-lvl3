import onChange from 'on-change';
import processStateHandler from './render/processStateHandler.js';
import feedsRender from './render/feedsRender.js';
import postsRender from './render/postsRender.js';
import feedbackRender from './render/feedbackRender.js';
import modalRender from './render/modalRender.js';

export default (state, i18nextInstance) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    switch (statePath) {
      case 'rssForm.processState':
        processStateHandler(currValue, i18nextInstance);
        break;
      case 'rssForm.rssData.feeds':
        feedsRender(currValue, i18nextInstance, watchedState);
        break;
      case 'rssForm.rssData.posts':
        postsRender(currValue, i18nextInstance, watchedState);
        break;
      case 'rssForm.currentFeedback':
        feedbackRender(currValue, i18nextInstance);
        break;
      case 'rssForm.currentModal':
        modalRender(currValue, i18nextInstance, watchedState);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
