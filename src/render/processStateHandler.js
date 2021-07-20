export default (processState, i18nextInstance, domElements) => {
  const {
    inputField, addButton, feedback, form,
  } = domElements;
  switch (processState) {
    case 'filling':
      addButton.disabled = false;
      inputField.focus();
      break;
    case 'sending':
      inputField.classList.remove('border', 'border-danger');
      feedback.textContent = '';
      inputField.readOnly = true;
      addButton.disabled = true;
      break;
    case 'finished':
      feedback.textContent = i18nextInstance.t('messages.success');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      inputField.readOnly = false;
      addButton.disabled = false;
      form.reset();
      break;
    case 'failed':
      inputField.classList.add('border', 'border-danger');
      inputField.readOnly = false;
      addButton.disabled = false;
      inputField.focus();
      break;
    default:
      throw new Error('Unknown State');
  }
};
