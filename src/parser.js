import _ from 'lodash';

export default (str) => {
  const responseData = new window.DOMParser().parseFromString(str, 'text/xml');

  const feedTitle = responseData.querySelector('title').innerHTML;
  const feedDescription = responseData.querySelector('description').innerHTML;

  const itemTitles = responseData.querySelectorAll('item title');
  const itemDescriptions = responseData.querySelectorAll('item description');
  const itemLinks = responseData.querySelectorAll('item link');

  const postTitles = Array.from(itemTitles)
    .map((itemTitle) => itemTitle.innerHTML);
  const postDescriptions = Array.from(itemDescriptions)
    .map((itemDescription) => itemDescription.innerHTML);
  const postLinks = Array.from(itemLinks)
    .map((postLink) => postLink.innerHTML);

  const postsData = _.zip(postTitles, postDescriptions, postLinks);

  const posts = {};
  let postId = 0;
  postsData.forEach((postData) => {
    posts[postId] = { title: postData[0], description: postData[1], link: postData[2] };
    postId += 1;
  });

  return {
    feedTitle,
    feedDescription,
    posts,
  };
};
