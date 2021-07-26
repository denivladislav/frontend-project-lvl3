import onChange from 'on-change';
import {
  processStateHandler, feedsRender, postsRender, errorRender, modalRender, viewedPostsRender,
} from './render/index.js';

export default (state, i18nextInstance, domElements) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    const viewsMap = {
      processState: processStateHandler,
      'rssData.feeds': feedsRender,
      'rssData.posts': postsRender,
      'uiState.modal': modalRender,
      'uiState.viewedPosts': viewedPostsRender,
      error: errorRender,
    };
    console.log(state);
    viewsMap[statePath](currValue, i18nextInstance, domElements, state);
  });
  return watchedState;
};
