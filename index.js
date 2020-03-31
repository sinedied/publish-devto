const core = require('@actions/core');
const { publishArticles } = require('./publish');

async function run() {
  try {
    const filesGlob = core.getInput('files');
    const devtoKey = core.getInput('devto_key');
    const githubToken = core.getInput('github_token');
    const useConventionalCommits = core.getInput('conventional_commits');
    core.setSecret(devtoKey);
    core.setSecret(githubToken);
    core.debug(JSON.stringify({ filesGlob, devtoKey, githubToken, useConventionalCommits}));

    core.info('Publishing articles publication on dev.to, please wait…');
    await publishArticles({
      filesGlob,
      devtoKey,
      githubToken,
      useConventionalCommits
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
