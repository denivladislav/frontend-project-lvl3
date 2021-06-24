const addButton = document.querySelector('[type="submit"]');

export const processStateHandler = (processState) => {
  switch (processState) {
    case 'filling':
      addButton.disabled = false;
      break;
    case 'sending':
      addButton.disabled = true;
      break;
    case 'finished':
      addButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

export const renderError = (value) => {
  if (value.length === 0) {
    return;
  }
  const feedbackElement = document.querySelector('[name="feedback"]');
  feedbackElement.classList.add('text-danger');
  feedbackElement.innerHTML = value[value.length - 1];
};
