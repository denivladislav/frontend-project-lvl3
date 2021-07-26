export default (xmlData) => {
  try {
    const parsedXmlData = new window.DOMParser().parseFromString(xmlData, 'text/xml');

    const title = parsedXmlData.querySelector('channel title').textContent;
    const description = parsedXmlData.querySelector('channel description').textContent;

    const itemElements = Array.from(parsedXmlData.querySelectorAll('item'));
    const items = itemElements.map((element) => ({
      title: element.querySelector('title').textContent,
      description: element.querySelector('description').textContent,
      url: element.querySelector('link').textContent.trim(),
    }));

    return {
      title,
      description,
      items,
    };
  } catch (e) {
    const error = new Error();
    error.isRssParseError = true;
    throw error;
  }
};
