import i18next from 'i18next';
import translationRU from './locales/ru.json';
import watch from './view.js';
import handleFormSubmit from './formSubmitHandler.js';
import checkFeedUpdates from './feedUpdatesChecker.js';

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
        currentModal: {},
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

      const delay = 5000;

      const watchedState = watch(state, i18nextInstance, domElements);

      const form = document.querySelector('.rss-form');
      form.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
      setTimeout(() => checkFeedUpdates(watchedState, delay), delay);
    });
};
