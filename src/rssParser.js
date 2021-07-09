export default (html) => {
  try {
    const parsedResponseData = new window.DOMParser().parseFromString(html, 'text/xml');

    const feedTitle = parsedResponseData.querySelector('channel title').textContent;
    const feedDescription = parsedResponseData.querySelector('channel description').textContent;
    const feedData = {
      title: feedTitle,
      description: feedDescription,
    };

    const itemsArray = Array.from(parsedResponseData.querySelectorAll('item'));
    const postsData = itemsArray.map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postDescription = item.querySelector('description').textContent;
      const postLink = item.querySelector('link').textContent;
      return {
        title: postTitle,
        description: postDescription,
        url: postLink,
      };
    });

    return {
      feedData,
      postsData,
    };
  } catch (e) {
    throw new Error('invalidRss');
  }
};
