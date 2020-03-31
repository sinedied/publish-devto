const got = require('got');
const matter = require('gray-matter');

async function getRemoteArticles(devtoKey) {
  try {
    // TODO: pagination
    const result = await got(
      'https://dev.to/api/articles/me/all?per_page=1000',
      {
        headers: { 'api-key': devtoKey },
        responseType: 'json'
      }
    );
    return result.body;
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.body);
    }

    throw error;
  }
}

async function updateRemoteArticle(article, devtoKey) {
  try {
    const markdown = matter.stringify(article, article.data);
    const { id } = article.data;
    const result = await got[id ? 'put' : 'post'](
      `https://dev.to/api/articles${id ? `/${id}` : ''}`,
      {
        headers: { 'api-key': devtoKey },
        json: { article: { title: article.title, body_markdown: markdown } },
        responseType: 'json'
      }
    );
    return result.body;
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.body.error);
    }

    throw error;
  }
}

module.exports = {
  getRemoteArticles,
  updateRemoteArticle
};
