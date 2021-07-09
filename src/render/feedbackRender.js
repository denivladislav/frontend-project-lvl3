export default (currentFeedback, i18nextInstance) => {
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
