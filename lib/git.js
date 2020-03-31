const { exec } = require('@actions/exec');
// Const { convertPathToPosix } = require('./util');

const commitTitle = `Update published articles`;
const commitName = `dev.to bot`;
const commitEmail = `sinedied+devtobot@gmail.com`;
const git = (command, args, flags = []) =>
  exec('git', [...flags, command, ...args]);

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
      ? `chore: ${commitTitle.toLowerCase()}`
      : commitTitle;
    commitMessage += ` [skip ci]`;
    // TODO: make it work
    // commitMessage += `\n\n- ${files
    //   .map(f => convertPathToPosix(f))
    //   .join('\n- ')}`;
    await git(
      'commit',
      ['-m', commitMessage],
      ['-c', `user.name="${commitName}"`, '-c', `user.email="${commitEmail}"`]
    );

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
