export default (url) => {
  const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get?');
  proxyUrl.searchParams.append('url', url);
  proxyUrl.searchParams.append('disableCache', true);
  return proxyUrl;
};
