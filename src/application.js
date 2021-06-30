/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import translationEN from './locales/en.json';
import parseRSS from './parser.js';
import watch from './view.js';

const proxy = (url) => `https://hexlet-allorigins.herokuapp.com/raw?url=${url}`;

yup.setLocale({
  string: {
    matches: 'invalidURL',
  },
});

const schema = yup.string()
  .required()
  // eslint-disable-next-line no-useless-escape
  .matches('https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}');

const validate = (form, i18nextInstance) => schema.validate(form.currentUrl)
  .then(() => {
    const urlIds = Object.keys(form.data);
    urlIds.forEach((urlId) => {
      if (form.data[urlId].url === form.currentUrl) {
        throw new Error('duplicateURL');
      }
    });
    return 'valid';
  })
  .catch((e) => {
    const errorKey = e.message;
    return i18nextInstance.t(`errors.${errorKey}`);
  });

let idNumber = -1;

const getId = () => {
  idNumber += 1;
  return idNumber;
};

const updateValidationState = (validationData, watchedState) => {
  if (validationData !== 'valid') {
    watchedState.rssForm.errors = watchedState.rssForm.errors.concat(validationData);
  } else watchedState.rssForm.errors = [];
  if (watchedState.rssForm.errors.length > 0) {
    watchedState.rssForm.valid = false;
  } else {
    watchedState.rssForm.valid = true;
  }
};

const regenerateFields = (postsHeader, feedsHeader) => {
  const display = document.querySelector('[name="display"]');

  const previousFeedback = document.querySelector('[name="feedback"]');
  if (previousFeedback) {
    document.querySelector('[name="feedback"]').remove();
  }
  const currentFeedback = document.createElement('p');
  currentFeedback.setAttribute('name', 'feedback');
  display.append(currentFeedback);

  const posts = document.querySelector('[name="posts"]');
  posts.innerHTML = `<h2>${postsHeader}</h2><ul></ul>`;

  const feeds = document.querySelector('[name="feeds"]');
  feeds.innerHTML = `<h2>${feedsHeader}</h2><ul></ul>`;
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: translationEN,
      },
    },
  })
    .then(() => {
      const state = {
        rssForm: {
          currentUrl: '',
          processState: 'filling',
          data: {},
          valid: true,
          errors: [],
        },
      };

      alert('Enter!');

      const watchedState = watch(state);

      const checkUpdates = () => {
        const urlIds = Object.keys(watchedState.rssForm.data);
        if (urlIds) {
          urlIds.forEach((urlId) => {
            const urlToCheck = watchedState.rssForm.data[urlId].url;
            axios.get(proxy(urlToCheck))
              .then((response) => parseRSS(response.data))
              .then((data) => {
                console.log('Enter!');
                const existingPosts = watchedState.rssForm.data[urlId].posts;
                let existingPostsIds = Object.keys(existingPosts);
                const existingPostsTitles = existingPostsIds
                  .map((existingPostId) => existingPosts[existingPostId].title);

                const dataPosts = data.posts;
                const dataPostsIds = Object.keys(dataPosts);
                const dataPostsTitles = dataPostsIds
                  .map((newPostId) => dataPosts[newPostId].title);

                // eslint-disable-next-line max-len
                const newPostsTitles = _.differenceWith(dataPostsTitles, existingPostsTitles, _.isEqual);

                dataPostsIds.forEach((dataPostsId) => {
                  newPostsTitles.forEach((newPostTitle) => {
                    if (dataPosts[dataPostsId].title === newPostTitle) {
                      existingPostsIds = Object.keys(watchedState.rssForm.data[urlId].posts);
                      const newPostId = Number(_.last(existingPostsIds)) + 1;
                      console.log(newPostId);
                      const newPostDescription = dataPosts[dataPostsId].description;
                      const newPostLink = dataPosts[dataPostsId].link;

                      watchedState.rssForm.data[urlId].posts[newPostId] = {
                        title: newPostTitle,
                        description: newPostDescription,
                        link: newPostLink,
                      };

                      const postsUl = document.querySelector('[name="posts"] ul');
                      const postLi = document.createElement('li');
                      const a = document.createElement('a');
                      a.href = newPostLink;
                      a.innerHTML = newPostTitle;
                      postLi.append(a);
                      postsUl.prepend(postLi);
                    }
                  });
                });
              });
          });
        }
        setTimeout(checkUpdates, 5000);
      };

      setTimeout(checkUpdates, 5000);

      const form = document.querySelector('form');
      const inputField = document.querySelector('[name="url"]');

      inputField.addEventListener('input', (e) => {
        e.preventDefault();
        watchedState.rssForm.currentUrl = e.target.value.trim();
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        validate(watchedState.rssForm, i18nextInstance)
          .then((validationData) => {
            updateValidationState(validationData, watchedState);
            if (watchedState.rssForm.valid === true) {
              watchedState.rssForm.processState = 'sending';
              axios.get(proxy(watchedState.rssForm.currentUrl))
                .then((response) => parseRSS(response.data))
                .then((data) => {
                  watchedState.rssForm.processState = 'finished';
                  regenerateFields(i18nextInstance.t('headers.posts'), i18nextInstance.t('headers.feeds'));
                  const feedback = document.querySelector('[name="feedback"]');
                  feedback.classList.add('text-success');
                  feedback.innerHTML = i18nextInstance.t('feedback.successfulRSSDownload');
                  const urlId = getId();
                  watchedState.rssForm.data[urlId] = {
                    url: watchedState.rssForm.currentUrl,
                    feed: {
                      feedId: urlId,
                      title: data.feedTitle,
                      description: data.feedDescription,
                    },
                    posts: data.posts,
                  };
                  const dataKeys = Object.keys(watchedState.rssForm.data);
                  dataKeys.forEach((key) => {
                    const currentData = watchedState.rssForm.data[key];
                    const feedLi = document.createElement('li');
                    const feedTitle = document.createElement('h4');
                    const feedDescription = document.createElement('p');
                    feedTitle.innerHTML = currentData.feed.title;
                    feedDescription.innerHTML = currentData.feed.description;
                    feedLi.append(feedTitle, feedDescription);
                    const feedsUl = document.querySelector('[name="feeds"] ul');
                    feedsUl.prepend(feedLi);

                    const postsUl = document.querySelector('[name="posts"] ul');
                    const postKeys = Object.keys(currentData.posts);
                    (_.reverse(postKeys)).forEach((postKey) => {
                      const postLi = document.createElement('li');
                      const a = document.createElement('a');
                      const button = document.createElement('button');
                      button.setAttribute('type', 'button');
                      button.classList.add('btn', 'btn-primary');
                      button.dataset.toggle = 'modal';
                      button.dataset.target = '#modal';
                      button.innerHTML = i18nextInstance.t('buttons.look');
                      button.addEventListener('click', (err) => {
                        err.preventDefault();
                        const modalTitle = document.querySelector('.modal-title');
                        modalTitle.innerHTML = currentData.posts[postKey].title;
                        const modalBody = document.querySelector('.modal-body');
                        modalBody.innerHTML = currentData.posts[postKey].description;
                        const closeButton = document.querySelector('#closeButton');
                        closeButton.innerHTML = i18nextInstance.t('buttons.close');
                        const readButton = document.querySelector('#readButton');
                        readButton.innerHTML = i18nextInstance.t('buttons.read');
                        readButton.setAttribute('onclick', `location.href="${currentData.posts[postKey].link}";`);
                        currentData.posts[postKey].viewed = true;
                        const currentA = document.querySelector(`[id="${postKey}"]`);
                        console.log(currentA);
                        currentA.style = 'color: gray';
                        currentA.classList.remove('fw-bold');
                        currentA.classList.add('fw-normal');
                      });
                      a.href = currentData.posts[postKey].link;
                      a.innerHTML = currentData.posts[postKey].title;
                      a.id = postKey;
                      a.classList.add('fw-bold');
                      postLi.append(a);
                      postLi.append(button);
                      postsUl.prepend(postLi);
                      console.log(postsUl);
                    });
                  });

                  form.reset();
                })
                .catch(() => updateValidationState(i18nextInstance.t('errors.invalidRSS'), watchedState));
            }
            watchedState.rssForm.processState = 'filling';
            inputField.focus();
          });
      });
      inputField.focus();
    });
};
