export const modalRenderer = (currentModal, i18nextInstance, domElements) => {
  const {
    modalTitle, modalBody, closeModalButton, readModalButton,
  } = domElements;

  modalTitle.textContent = currentModal.title;
  modalBody.textContent = currentModal.body;
  closeModalButton.textContent = i18nextInstance.t('buttons.close');
  readModalButton.textContent = i18nextInstance.t('buttons.read');
  readModalButton.href = currentModal.url;
};
