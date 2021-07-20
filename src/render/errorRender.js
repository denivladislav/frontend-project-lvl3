export default (error, i18nextInstance, domElements) => {
  const { feedback } = domElements;
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  switch (true) {
    case error.name === 'ValidationError':
      feedback.innerHTML = i18nextInstance.t(`errors.${error.message}`);
      break;
    case error.isRssParseError:
      feedback.innerHTML = i18nextInstance.t('errors.invalidRss');
      break;
    case error.isAxiosError:
      feedback.innerHTML = i18nextInstance.t('errors.networkError');
      break;
    default:
      feedback.innerHTML = i18nextInstance.t('errors.unknownError');
      break;
  }
};
