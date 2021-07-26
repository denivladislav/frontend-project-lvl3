const getErrorMessage = (error, i18nextInstance) => {
  if (error.name === 'ValidationError') {
    return i18nextInstance.t(`errors.${error.message}`);
  }
  if (error.isRssParseError) {
    return i18nextInstance.t('errors.invalidRss');
  }
  if (error.isAxiosError) {
    return i18nextInstance.t('errors.networkError');
  }
  return i18nextInstance.t('errors.unknownError');
};

export const errorRenderer = (error, i18nextInstance, domElements) => {
  const { feedback } = domElements;
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = getErrorMessage(error, i18nextInstance);
};
