import _ from 'lodash';

const postClickHandler = (event, watchedState) => {
  const elementId = event.target.dataset.id;
  if (!elementId) {
    return;
  }

  const oldPosts = watchedState.rssData.posts;
  const clonedPosts = _.cloneDeep(oldPosts);
  const viewedPost = _.find((clonedPosts), { id: elementId });
  viewedPost.viewed = true;
  watchedState.rssData.posts = clonedPosts;

  const newModal = {
    title: viewedPost.title,
    body: viewedPost.description,
    url: viewedPost.url,
  };
  watchedState.currentModal = newModal;
};

export default postClickHandler;
