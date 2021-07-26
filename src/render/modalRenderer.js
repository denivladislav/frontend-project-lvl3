export const modalRenderer = (modal, i18nextInstance, domElements) => {
  const {
    modalTitle, modalBody, closeModalButton, readModalButton,
  } = domElements;
  modalTitle.textContent = modal.title;
  modalBody.textContent = modal.description;
  closeModalButton.textContent = i18nextInstance.t('buttons.close');
  readModalButton.textContent = i18nextInstance.t('buttons.read');
  readModalButton.href = modal.url;
};
