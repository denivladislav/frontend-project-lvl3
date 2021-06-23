import onChange from 'on-change';
import { processStateHandler, renderError } from './handlers.js';

const inputField = document.querySelector('[name="url"]');

export default (state) => onChange(state, (statePath, currValue) => {
  switch (statePath) {
    case 'rssForm.processState':
      processStateHandler(currValue);
      break;
    case 'rssForm.valid':
      if (currValue) {
        inputField.style.border = null;
      } else {
        inputField.style.border = 'thick solid red';
      }
      break;
    case 'rssForm.errors':
      renderError(currValue);
      break;
    default:
      break;
  }
});
