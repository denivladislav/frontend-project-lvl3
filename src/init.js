import i18next from 'i18next';
import translationRU from './locales/ru.json';
import watch from './view.js';
import handleFormSubmit from './formSubmitHandler.js';
import subscribeToFeedsUpdates from './subscribeToFeedsUpdates.js';
import handlePostClick from './postClickHandler';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: translationRU,
      },
    },
  })
    .then(() => {
      const state = {
        processState: 'filling',
        rssData: {
          feeds: [],
          posts: [],
        },
        uiState: {
          modal: {},
          viewedPosts: [],
        },
        error: null,
      };

      const domElements = {
        inputField: document.querySelector('#url-input'),
        addButton: document.querySelector('#addButton'),
        feedback: document.querySelector('.feedback'),
        form: document.querySelector('.rss-form'),
        feeds: document.querySelector('#feeds'),
        posts: document.querySelector('#posts'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        closeModalButton: document.querySelector('#closeModalButton'),
        readModalButton: document.querySelector('#readModalButton'),
      };

      const watchedState = watch(state, i18nextInstance, domElements);

      const { form, posts } = domElements;
      form.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
      posts.addEventListener('click', (event) => handlePostClick(event, watchedState));
      subscribeToFeedsUpdates(watchedState);
    });
};
