export default (currentModal, i18nextInstance, domElements) => {
  const {
    modalTitle, modalBody, closeModalButton, readModalButton,
  } = domElements;

  modalTitle.innerHTML = currentModal.title;
  modalBody.innerHTML = currentModal.body;
  closeModalButton.innerHTML = i18nextInstance.t('buttons.close');
  readModalButton.innerHTML = i18nextInstance.t('buttons.read');
  readModalButton.href = currentModal.url;
};
