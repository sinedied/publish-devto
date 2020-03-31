const chalk = require('chalk');
const {
  getArticlesFromFiles,
  prepareArticleForDevto,
  updateLocalArticle
} = require('./lib/article');
const { updateRemoteArticle } = require('./lib/devto');
const { getRepositoryFromPackage } = require('./lib/util');
const { commitAndPushUpdatedArticles } = require('./lib/git');

async function publishArticles(options) {
  try {
    const repository = await getRepositoryFromPackage();
    const articles = await getArticlesFromFiles(options.filesGlob);

    console.log(chalk`Found {green ${articles.length}} article(s)`);

    // TODO: throttle
    await Promise.all(
      articles.map(async article => {
        const newArticle = prepareArticleForDevto(article, repository);

        // TODO: check if need to update before POST/PUT
        // console.log(matter.stringify(newArticle.content, newArticle.data))

        const result = await updateRemoteArticle(newArticle, options.devtoKey);

        // TODO: set status, try/catch here

        await updateLocalArticle(article, result);

        // TODO: log results
      })
    );

    await commitAndPushUpdatedArticles(
      articles,
      repository,
      options.githubToken,
      options.conventional
    );
  } catch (error) {
    console.error(chalk`Error: ${error.message}`);
    throw new Error(`Publish failed`);
  }
}

module.exports = {
  publishArticles
};
