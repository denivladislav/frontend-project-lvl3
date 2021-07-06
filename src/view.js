/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';
import {
  addButton, feedback,
  feeds, posts,
  inputField,
} from './constants.js';

const getLookButtonHandler = (watchedState, urlId, postId) => function handler(e) {
  e.preventDefault();
  const oldData = watchedState.rssForm.data;
  const newData = _.cloneDeep(oldData);
  const currentPost = newData[urlId].posts[postId];
  currentPost.viewed = true;
  watchedState.rssForm.data = newData;

  const newModalData = {
    title: currentPost.title,
    body: currentPost.description,
  };

  watchedState.rssForm.modal = newModalData;

  console.log('lookButtonHandler Performed!');
  console.log(watchedState.rssForm);
};

const processStateRender = (processState) => {
  switch (processState) {
    case 'filling':
      addButton.disabled = false;
      break;
    case 'sending':
      feedback.innerHTML = '';
      addButton.disabled = true;
      break;
    case 'finished':
      addButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

const feedbackRender = (feedbackData, i18nextInstance) => {
  switch (feedbackData.type) {
    case 'successMessage':
      feedback.innerHTML = i18nextInstance.t('messages.success');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      break;
    case 'errorMessage':
      feedback.innerHTML = i18nextInstance.t(`errors.${feedbackData.tag}`);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;
    default:
      break;
  }
};

const dataRender = (data, i18nextInstance, watchedState) => {
  feeds.innerHTML = `<h2 class="h4 m-0">${i18nextInstance.t('headers.feeds')}</h2>`;
  posts.innerHTML = `<h2 class="h4 m-0">${i18nextInstance.t('headers.posts')}</h2>`;

  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');

  const urlIds = _.reverse(_.keys(data));
  urlIds.forEach((urlId) => {
    const currentFeed = data[urlId].feed;
    const feedTitle = currentFeed.title;
    const feedDescription = currentFeed.description;
    feedsUl.innerHTML += `
      <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${feedTitle}</h3>
        <p class="m-0 small text-black-50">${feedDescription}</p>
      </li>
    `;

    const postIds = _.keys(data[urlId].posts);
    postIds.forEach((postId) => {
      const currentPost = data[urlId].posts[postId];
      const postTitle = currentPost.title;
      const postLink = currentPost.link;
      const lookButtonName = i18nextInstance.t('buttons.look');
      let postLinkBoldness;
      if (currentPost.viewed) {
        postLinkBoldness = 'fw-normal';
      } else postLinkBoldness = 'fw-bold';

      const postLi = document.createElement('li');
      postLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const a = document.createElement('a');
      a.href = `${postLink}`;
      a.classList.add(`${postLinkBoldness}`);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.innerHTML = `${postTitle}`;

      const lookButton = document.createElement('button');
      lookButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      lookButton.setAttribute('type', 'button');
      lookButton.dataset.toggle = 'modal';
      lookButton.dataset.target = '#modal';
      lookButton.innerHTML = `${lookButtonName}`;
      lookButton.addEventListener('click', getLookButtonHandler(watchedState, urlId, postId));

      postLi.append(a);
      postLi.append(lookButton);
      if (currentPost.new) {
        postsUl.prepend(postLi);
      } else postsUl.append(postLi);
    });
  });

  feeds.append(feedsUl);
  posts.append(postsUl);
};

const modalRender = (modalData, i18nextInstance) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.innerHTML = modalData.title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = modalData.body;

  const closeModalButton = document.querySelector('#closeModalButton');
  closeModalButton.innerHTML = i18nextInstance.t('buttons.close');

  const readModalButton = document.querySelector('#readModalButton');
  readModalButton.innerHTML = i18nextInstance.t('buttons.read');
};

export default (state, i18nextInstance) => {
  const watchedState = onChange(state, (statePath, currValue) => {
    switch (statePath) {
      case 'rssForm.processState':
        processStateRender(currValue);
        break;
      case 'rssForm.feedback':
        feedbackRender(currValue, i18nextInstance);
        break;
      case 'rssForm.data':
        // console.log('I enter Data Render!');
        dataRender(currValue, i18nextInstance, watchedState);
        break;
      case 'rssForm.modal':
        // console.log('I ENTER MODAL RENDER');
        modalRender(currValue, i18nextInstance);
        break;
      case 'rssForm.valid':
        if (currValue) {
          inputField.classList.remove('border', 'border-danger');
        } else {
          inputField.classList.add('border', 'border-danger');
        }
        break;
      default:
        break;
    }
  });
  return watchedState;
};
