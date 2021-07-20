import _ from 'lodash';

const getPostClickHandler = (watchedState, viewedPostId) => {
  const postClickHandler = () => {
    const oldPosts = watchedState.rssData.posts;
    const clonedPosts = _.cloneDeep(oldPosts);
    const viewedPost = _.find((clonedPosts), { postId: viewedPostId });
    viewedPost.viewed = true;
    watchedState.rssData.posts = clonedPosts;

    const newModal = {
      title: viewedPost.title,
      body: viewedPost.description,
      url: viewedPost.url,
    };
    watchedState.currentModal = newModal;
  };
  return postClickHandler;
};

const createPostElement = (post, i18nextInstance, watchedState) => {
  const postElement = document.createElement('li');
  postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.href = `${post.url}`;
  if (post.viewed) {
    link.classList.add('fw-normal', 'link-secondary');
  } else {
    link.classList.add('fw-bold', 'link-primary');
  }
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = `${post.title}`;
  link.addEventListener('click', getPostClickHandler(watchedState, post.postId));

  const lookButton = document.createElement('button');
  lookButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  lookButton.setAttribute('type', 'button');
  lookButton.dataset.bsToggle = 'modal';
  lookButton.dataset.bsTarget = '#modal';
  lookButton.textContent = `${i18nextInstance.t('buttons.look')}`;
  lookButton.addEventListener('click', getPostClickHandler(watchedState, post.postId));

  postElement.append(link, lookButton);
  return postElement;
};

const postsRender = (posts, i18nextInstance, watchedState) => {
  const postsCard = document.querySelector('#posts');
  postsCard.innerHTML = `
    <div class="card-body">
        <h2 class="h4 m-0">${i18nextInstance.t('headers.posts')}</h2>
    </div>    
  `;

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const postsElements = posts.map((post) => createPostElement(post, i18nextInstance, watchedState));
  postsList.append(...postsElements);

  postsCard.append(postsList);
};

export default postsRender;
