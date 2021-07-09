export default (currentModal, i18nextInstance) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.innerHTML = currentModal.title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = currentModal.body;

  const closeModalButton = document.querySelector('#closeModalButton');
  closeModalButton.innerHTML = i18nextInstance.t('buttons.close');

  const readModalButton = document.querySelector('#readModalButton');
  readModalButton.innerHTML = i18nextInstance.t('buttons.read');
  readModalButton.href = currentModal.url;
};
