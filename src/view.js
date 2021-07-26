import onChange from 'on-change';
import {
  processStateHandler, feedsRender, postsRender, errorRender, modalRender,
} from './render/index.js';

export default (state, i18nextInstance, domElements) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    const viewsMap = {
      processState: processStateHandler,
      'rssData.feeds': feedsRender,
      'rssData.posts': postsRender,
      error: errorRender,
      currentModal: modalRender,
    };
    viewsMap[statePath](currValue, i18nextInstance, domElements);
  });
  return watchedState;
};
