import { getRepository, push, SyncStatus } from '@sinedied/devto-cli';
import { commitAndPushUpdatedArticles } from './git.js';

export async function publishArticles(options) {
  const results = await push([options.filesGlob], {
    devtoKey: options.devtoKey,
    branch: options.branch,
    checkImages: true
  });

  const shouldCommit = results.some(
    (result) =>
      result.status === SyncStatus.created ||
      result.status === SyncStatus.updated ||
      result.status === SyncStatus.reconciled
  );

  const repository = await getRepository();

  if (shouldCommit) {
    await commitAndPushUpdatedArticles(
      results.map((result) => result.article),
      repository,
      options.branch,
      options.githubToken,
      options.useConventionalCommits
    );
  } else {
    console.log('No detected changes, skipping commit step.');
  }
}
