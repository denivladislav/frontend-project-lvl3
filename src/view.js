import onChange from 'on-change';
import {
  processStateHandler, feedsRenderer, postsRenderer,
  errorRenderer, modalRenderer, viewedPostsRenderer,
} from './render/index.js';

export default (state, i18nextInstance, domElements) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    const viewsMap = {
      processState: processStateHandler,
      'rssData.feeds': feedsRenderer,
      'rssData.posts': postsRenderer,
      'uiState.modal': modalRenderer,
      'uiState.viewedPosts': viewedPostsRenderer,
      error: errorRenderer,
    };
    viewsMap[statePath](currValue, i18nextInstance, domElements, state);
  });
  return watchedState;
};
