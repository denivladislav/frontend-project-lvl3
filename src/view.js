import onChange from 'on-change';
import processStateHandler from './render/processStateHandler.js';
import feedsRender from './render/feedsRender.js';
import postsRender from './render/postsRender.js';
import errorRender from './render/errorRender.js';
import modalRender from './render/modalRender.js';

export default (state, i18nextInstance, domElements) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    switch (statePath) {
      case 'processState':
        processStateHandler(currValue, i18nextInstance, domElements);
        break;
      case 'rssData.feeds':
        feedsRender(currValue, i18nextInstance, domElements);
        break;
      case 'rssData.posts':
        postsRender(currValue, i18nextInstance, watchedState, domElements);
        break;
      case 'error':
        errorRender(currValue, i18nextInstance, domElements);
        break;
      case 'currentModal':
        modalRender(currValue, i18nextInstance, domElements);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
