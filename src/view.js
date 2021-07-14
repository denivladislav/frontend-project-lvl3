import onChange from 'on-change';
import processStateHandler from './render/processStateHandler.js';
import feedsRender from './render/feedsRender.js';
import postsRender from './render/postsRender.js';
import errorRender from './render/errorRender.js';
import modalRender from './render/modalRender.js';

export default (state, i18nextInstance, domElements) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    switch (statePath) {
      case 'rssForm.processState':
        processStateHandler(currValue, i18nextInstance, domElements);
        break;
      case 'rssForm.rssData.feeds':
        feedsRender(currValue, i18nextInstance, watchedState);
        break;
      case 'rssForm.rssData.posts':
        postsRender(currValue, i18nextInstance, watchedState);
        break;
      case 'rssForm.error':
        errorRender(currValue, i18nextInstance);
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
