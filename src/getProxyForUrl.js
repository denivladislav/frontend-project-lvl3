export default (url) => {
  const proxyForUrl = new URL('https://hexlet-allorigins.herokuapp.com/get?');
  proxyForUrl.searchParams.append('url', url);
  proxyForUrl.searchParams.append('disableCache', true);
  return proxyForUrl;
};
