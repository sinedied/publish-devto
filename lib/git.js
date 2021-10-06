import { exec } from '@actions/exec';

// Const convertPathToPosix = (path) => path.replace(/\\/g, '/');
const commitTitle = `Update published articles`;
const commitName = `dev.to bot`;
const commitEmail = `sinedied+devtobot@gmail.com`;
const git = (command, args, flags = []) =>
  exec('git', [...flags, command, ...args]);

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

    await git('push', [getRepositoryUrl(repo, githubToken), `HEAD:${branch}`]);
  } catch (error) {
    throw new Error(`Cannot commit changes: ${error.message}`);
  }
}
