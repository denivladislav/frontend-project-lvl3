export default (processState, i18nextInstance) => {
  const inputField = document.querySelector('#url-input');
  const addButton = document.querySelector('#addButton');
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  switch (processState) {
    case 'filling':
      addButton.disabled = false;
      inputField.focus();
      break;
    case 'sending':
      inputField.classList.remove('border', 'border-danger');
      feedback.innerHTML = '';
      inputField.readOnly = true;
      addButton.disabled = true;
      break;
    case 'finished':
      inputField.readOnly = false;
      addButton.disabled = false;
      form.reset();
      break;
    case 'failed':
      inputField.classList.add('border', 'border-danger');
      inputField.readOnly = false;
      addButton.disabled = false;
      break;
    default:
      throw new Error(`${i18nextInstance.t('errors.unknownState')}: ${processState}`);
  }
};
