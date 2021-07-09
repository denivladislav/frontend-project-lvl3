import _ from 'lodash';

export const processStateHandler = (processState, i18nextInstance) => {
  const inputField = document.querySelector('#url-input');
  const addButton = document.querySelector('#addButton');
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  switch (processState) {
    case 'filling':
      addButton.disabled = false;
      inputField.focus();
      break;
    case 'sending':
      inputField.classList.remove('border', 'border-danger');
      feedback.innerHTML = '';
      inputField.readOnly = true;
      addButton.disabled = true;
      break;
    case 'finished':
      inputField.readOnly = false;
      addButton.disabled = false;
      form.reset();
      break;
    case 'failed':
      inputField.classList.add('border', 'border-danger');
      inputField.readOnly = false;
      addButton.disabled = false;
      break;
    default:
      throw new Error(`${i18nextInstance.t('errors.unknownState')}: ${processState}`);
  }
};

export const feedbackRender = (currentFeedback, i18nextInstance) => {
  const feedback = document.querySelector('.feedback');
  switch (currentFeedback.type) {
    case 'successMessage':
      feedback.innerHTML = i18nextInstance.t('messages.success');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      break;
    case 'errorMessage':
      feedback.innerHTML = i18nextInstance.t(`errors.${currentFeedback.tag}`);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;
    default:
      break;
  }
};

export const feedsRender = (feeds, i18nextInstance) => {
  const feedsDiv = document.querySelector('#feeds');
  feedsDiv.innerHTML = `
    <div class="card-body">
      <h2 class="h4 m-0">${i18nextInstance.t('headers.feeds')}</h2>
    </div>  
  `;
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    feedsUl.innerHTML += `
      <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${feed.title}</h3>
        <p class="m-0 small text-black-50">${feed.description}</p>
      </li>
    `;
  });

  feedsDiv.append(feedsUl);
};

const getLookHandler = (watchedState, viewedPostId) => function handler() {
  const oldPosts = watchedState.rssForm.rssData.posts;
  const clonedPosts = _.cloneDeep(oldPosts);
  const viewedPost = _.find((clonedPosts), { postId: viewedPostId });
  viewedPost.viewed = true;
  watchedState.rssForm.rssData.posts = clonedPosts;

  const newModal = {
    title: viewedPost.title,
    body: viewedPost.description,
    link: viewedPost.link,
  };

  watchedState.rssForm.currentModal = newModal;
};

export const postsRender = (posts, i18nextInstance, watchedState) => {
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
    link.href = `${post.link}`;
    if (post.viewed) {
      link.classList.add('fw-normal', 'link-secondary');
    } else link.classList.add('fw-bold', 'link-primary');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.innerHTML = `${post.title}`;
    link.addEventListener('click', getLookHandler(watchedState, post.postId));

    const lookButton = document.createElement('button');
    lookButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    lookButton.setAttribute('type', 'button');
    lookButton.dataset.toggle = 'modal';
    lookButton.dataset.target = '#modal';
    lookButton.innerHTML = `${i18nextInstance.t('buttons.look')}`;
    lookButton.addEventListener('click', getLookHandler(watchedState, post.postId));

    postLi.append(link);
    postLi.append(lookButton);

    postsUl.append(postLi);
  });
  postsDiv.append(postsUl);
};

export const modalRender = (currentModal, i18nextInstance) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.innerHTML = currentModal.title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = currentModal.body;

  const closeModalButton = document.querySelector('#closeModalButton');
  closeModalButton.innerHTML = i18nextInstance.t('buttons.close');

  const readModalButton = document.querySelector('#readModalButton');
  readModalButton.innerHTML = i18nextInstance.t('buttons.read');
  readModalButton.href = currentModal.link;
};
