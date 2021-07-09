import onChange from 'on-change';
import {
  processStateHandler, feedbackRender,
  feedsRender, postsRender, modalRender,
} from './render.js';

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
