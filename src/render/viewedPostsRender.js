import _ from 'lodash';

const viewedPostsRender = (viewedPosts, _i18nextInstance, domElements) => {
  const links = domElements.posts.querySelectorAll('a');
  links.forEach((link) => {
    if (_.includes(viewedPosts, link.dataset.id)) {
      link.classList.remove('fw-bold', 'link-primary');
      link.classList.add('fw-normal', 'link-secondary');
    }
  });
};

export default viewedPostsRender;
