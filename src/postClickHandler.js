import _ from 'lodash';

const postClickHandler = (event, watchedState) => {
  const elementId = event.target.dataset.id;
  if (!elementId) {
    return;
  }

  const { posts } = watchedState.rssData;
  const newViewedPost = _.find(posts, { id: elementId });
  const oldViewedPosts = watchedState.uiState.viewedPosts;
  watchedState.uiState.viewedPosts = [...oldViewedPosts, newViewedPost.id];

  watchedState.uiState.modal = {
    title: newViewedPost.title,
    body: newViewedPost.description,
    url: newViewedPost.url,
  };
};

export default postClickHandler;
