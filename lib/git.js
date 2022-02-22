import process from 'node:process';
import { getExecOutput } from '@actions/exec';

// Const convertPathToPosix = (path) => path.replace(/\\/g, '/');
const commitTitle = `Update published articles`;
const commitName = process.env.GIT_COMMITTER_NAME || `dev.to bot`;
const commitEmail =
  process.env.GIT_COMMITTER_EMAIL || `sinedied+devtobot@gmail.com`;
const git = (command, args, flags = []) =>
  getExecOutput('git', [...flags, command, ...args]);

const getRepositoryUrl = (repository, githubToken) =>
  `https://${githubToken}@github.com/${repository.user}/${repository.name}.git`;

export async function commitAndPushUpdatedArticles(
  articles,
  repo,
  branch,
  githubToken,
  conventional = false
) {
  try {
    const files = articles.map((a) => a.file);
    await git('add', files);

    const status = await git('status', ['--porcelain']);
    if (status.stdout) {
      let commitMessage = conventional
        ? `chore: ${commitTitle.toLowerCase()}`
        : commitTitle;
      commitMessage += ` [skip ci]`;

      await git(
        'commit',
        ['-m', commitMessage],
        ['-c', `user.name="${commitName}"`, '-c', `user.email="${commitEmail}"`]
      );

      await git('push', [
        getRepositoryUrl(repo, githubToken),
        `HEAD:${branch}`
      ]);
    } else {
      console.log('Nothing to commit');
    }
  } catch (error) {
    throw new Error(`Cannot commit changes: ${error.message}`);
  }
}
