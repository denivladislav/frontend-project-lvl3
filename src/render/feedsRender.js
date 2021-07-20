export default (feeds, i18nextInstance, domElements) => {
  const feedsCard = domElements.feeds;
  feedsCard.innerHTML = `
    <div class="card-body">
      <h2 class="h4 m-0">${i18nextInstance.t('headers.feeds')}</h2>
    </div>  
  `;
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feedsList.innerHTML = feeds.map((feed) => `
      <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${feed.title}</h3>
        <p class="m-0 small text-black-50">${feed.description}</p>
      </li>
    `)
    .join('\n');

  feedsCard.append(feedsList);
};
