import _ from 'lodash';

export default (str) => {
  try {
    const responseData = new window.DOMParser().parseFromString(str, 'text/xml');

    const feedTitle = responseData.querySelector('channel title').textContent;
    const feedDescription = responseData.querySelector('channel description').textContent;

    const feed = {
      title: feedTitle,
      description: feedDescription,
    };

    const itemTitles = responseData.querySelectorAll('item title');
    const itemDescriptions = responseData.querySelectorAll('item description');
    const itemLinks = responseData.querySelectorAll('item link');

    const postTitles = Array.from(itemTitles)
      .map((itemTitle) => itemTitle.textContent);

    const postDescriptions = Array.from(itemDescriptions)
      .map((itemDescription) => itemDescription.textContent);

    const postLinks = Array.from(itemLinks)
      .map((postLink) => postLink.textContent);

    const postsData = _.zip(postTitles, postDescriptions, postLinks);

    const posts = {};

    postsData.forEach((postData) => {
      const postId = _.uniqueId();
      posts[postId] = {
        title: postData[0],
        description: postData[1],
        link: postData[2],
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
