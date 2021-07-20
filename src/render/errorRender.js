export default (error, i18nextInstance, domElements) => {
  const { feedback } = domElements;
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  switch (true) {
    case error.name === 'ValidationError':
      feedback.textContent = i18nextInstance.t(`errors.${error.message}`);
      break;
    case error.isRssParseError:
      feedback.textContent = i18nextInstance.t('errors.invalidRss');
      break;
    case error.isAxiosError:
      feedback.textContent = i18nextInstance.t('errors.networkError');
      break;
    default:
      feedback.textContent = i18nextInstance.t('errors.unknownError');
      break;
  }
};
