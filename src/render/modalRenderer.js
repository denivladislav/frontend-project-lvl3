export default (modal, i18nextInstance, domElements, watchedState) => {
  const {
    modalTitle, modalBody, closeModalButton, readModalButton,
  } = domElements;
  const currentPost = watchedState.rssData.posts.find((post) => post.id === modal.postId);
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
  closeModalButton.textContent = i18nextInstance.t('buttons.close');
  readModalButton.textContent = i18nextInstance.t('buttons.read');
  readModalButton.href = currentPost.url;
};
