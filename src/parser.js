export default (response) => {
  try {
    const { url } = response.config.params;
    const responseData = response.data.contents;
    const parsedResponseData = new window.DOMParser().parseFromString(responseData, 'text/xml');

    const feedTitle = parsedResponseData.querySelector('channel title').textContent;
    const feedDescription = parsedResponseData.querySelector('channel description').textContent;

    const feed = {
      title: feedTitle,
      description: feedDescription,
      url,
    };

    const itemsArray = Array.from(parsedResponseData.querySelectorAll('item'));
    const posts = itemsArray.map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postDescription = item.querySelector('description').textContent;
      const postLink = item.querySelector('link').textContent;
      return {
        title: postTitle,
        description: postDescription,
        link: postLink,
        viewed: false,
      };
    });

    return {
      feed,
      posts,
    };
  } catch (e) {
    throw new Error('invalidRss');
  }
};
