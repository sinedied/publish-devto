import core from '@actions/core';
import { formatErrors, formatResultsTable } from '@sinedied/devto-cli';
import { publishArticles } from './lib/publish.js';

async function run() {
  try {
    const devtoKey = core.getInput('devto_key');
    const githubToken = core.getInput('github_token');
    const filesGlob = core.getInput('files');
    const branch = core.getInput('branch');
    const useConventionalCommits = core.getInput('conventional_commits');
    const dryRun = core.getBooleanInput('dry_run');

    core.setSecret(devtoKey);
    core.setSecret(githubToken);

    core.debug(
      JSON.stringify({
        devtoKey,
        githubToken,
        filesGlob,
        branch,
        useConventionalCommits,
        dryRun
      })
    );

    const results = await publishArticles({
      filesGlob,
      devtoKey,
      githubToken,
      branch,
      useConventionalCommits,
      dryRun
    });

    const output = results.map((r) => ({
      id: r.article.data.id,
      title: r.article.data.title,
      status: r.status,
      publishedStatus: r.publishedStatus,
      errors: r.errors
    }));
    const json = JSON.stringify(output, null, 2);
    core.debug('Output result_json:\n' + json);
    core.setOutput('result_json', json);

    let summary = `Found ${results.length} article(s)\n`;
    const errors = formatErrors(results);
    if (errors) {
      summary += errors + '\n';
    }

    if (results.length > 0) {
      summary += formatResultsTable(results);
    }

    core.debug('Output result_summary:\n' + summary);
    core.setOutput('result_summary', summary);
  } catch (error) {
    core.setFailed(error.toString());
  }
}

run();
