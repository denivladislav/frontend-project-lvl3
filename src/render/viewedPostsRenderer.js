import _ from 'lodash';

export const viewedPostsRenderer = (viewedPosts, _i18nextInstance, domElements) => {
  const links = domElements.posts.querySelectorAll('a');
  links.forEach((link) => {
    if (_.includes(viewedPosts, link.dataset.id)) {
      link.classList.remove('fw-bold', 'link-primary');
      link.classList.add('fw-normal', 'link-secondary');
    }
  });
};
