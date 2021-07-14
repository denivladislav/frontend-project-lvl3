import _ from 'lodash';

const getPostClickHandler = (watchedState, viewedPostId) => function handler() {
  const oldPosts = watchedState.rssForm.rssData.posts;
  const clonedPosts = _.cloneDeep(oldPosts);
  const viewedPost = _.find((clonedPosts), { postId: viewedPostId });
  viewedPost.viewed = true;
  watchedState.rssForm.rssData.posts = clonedPosts;

  const newModal = {
    title: viewedPost.title,
    body: viewedPost.description,
    url: viewedPost.url,
  };
  watchedState.rssForm.currentModal = newModal;
};

export default (posts, i18nextInstance, watchedState) => {
  const postsDiv = document.querySelector('#posts');
  postsDiv.innerHTML = `
    <div class="card-body">
        <h2 class="h4 m-0">${i18nextInstance.t('headers.posts')}</h2>
    </div>    
  `;

  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const postLi = document.createElement('li');
    postLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.href = `${post.url}`;
    if (post.viewed) {
      link.classList.add('fw-normal', 'link-secondary');
    } else link.classList.add('fw-bold', 'link-primary');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.innerHTML = `${post.title}`;
    link.addEventListener('click', getPostClickHandler(watchedState, post.postId));

    const lookButton = document.createElement('button');
    lookButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    lookButton.setAttribute('type', 'button');
    lookButton.dataset.toggle = 'modal';
    lookButton.dataset.target = '#modal';
    lookButton.innerHTML = `${i18nextInstance.t('buttons.look')}`;
    lookButton.addEventListener('click', getPostClickHandler(watchedState, post.postId));

    postLi.append(link);
    postLi.append(lookButton);

    postsUl.append(postLi);
  });

  postsDiv.append(postsUl);
};
