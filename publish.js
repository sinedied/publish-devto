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

    console.info(chalk`Found {green ${articles.length}} article(s)`);
    console.info('Publishing articles on dev.to, please wait…');

    let shouldCommit = false;

    // TODO: throttle
    await Promise.all(
      articles.map(async article => {
        const newArticle = prepareArticleForDevto(article, repository);

        // TODO: check if need to update before POST/PUT
        // console.log(matter.stringify(newArticle.content, newArticle.data))

        const result = await updateRemoteArticle(newArticle, options.devtoKey);

        // TODO: set status, try/catch here

        const localArticle = await updateLocalArticle(article, result);
        shouldCommit |= localArticle.hasChanged;
        // TODO: log results
      })
    );

    if (shouldCommit) {
      await commitAndPushUpdatedArticles(
        articles,
        repository,
        options.githubToken,
        options.useConventionalCommits
      );
    }
  } catch (error) {
    console.error(chalk`Error: ${error.message}`);
    throw new Error(`Publish failed`);
  }
}

module.exports = {
  publishArticles
};
