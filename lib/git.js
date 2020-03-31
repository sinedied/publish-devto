const { exec } = require('@actions/exec');
const { convertPathToPosix } = require('./util');

const commitTitle = `Update published articles`;
const commitName = `dev.to bot`;
const commitEmail = `sinedied+devtobot@gmail.com`;
const git = (command, args) => exec('git', [command, ...args]);

const getRepositoryUrl = (repository, githubToken) =>
  `https://${githubToken}@github.com/${repository.user}/${repository.name}.git`;

async function commitAndPushUpdatedArticles(
  articles,
  repository,
  githubToken,
  conventional = false
) {
  try {
    // TODO: check if master branch
    const files = articles.map(a => a.file);
    await git('add', files);

    let commitMessage = conventional
      ? `chore: ${commitTitle.toLowerCase()} [skip ci]`
      : commitTitle;
    commitMessage += `\n\n- ${files
      .map(f => convertPathToPosix(f))
      .join('\n- ')}`;
    await git('commit', [
      '-c',
      `user.name="${commitName}"`,
      '-c',
      `user.email="${commitEmail}"`,
      '-m',
      commitMessage
    ]);

    await git('push', [
      getRepositoryUrl(repository, githubToken),
      'HEAD:master'
    ]);
  } catch (error) {
    throw new Error(`Cannot commit changes: ${error.message}`);
  }
}

module.exports = {
  commitAndPushUpdatedArticles
};
