import i18next from 'i18next';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import watch from './view.js';
import getFormHandler from './formHandler.js';
import checkFeedUpdates from './checkFeedUpdates.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      en: {
        translation: translationEN,
      },
      ru: {
        translation: translationRU,
      },
    },
  })
    .then(() => {
      const state = {
        rssForm: {
          processState: 'filling',
          rssData: {
            feeds: [],
            posts: [],
          },
          currentFeedback: {},
          currentModal: {},
        },
      };

      const watchedState = watch(state, i18nextInstance);

      const form = document.querySelector('.rss-form');
      form.addEventListener('submit', getFormHandler(watchedState));

      setTimeout(() => checkFeedUpdates(watchedState), 5000);
    });
};
