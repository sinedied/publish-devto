import core from '@actions/core';
import { table, getBorderCharacters } from 'table';
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

    const output = await publishArticles({
      filesGlob,
      devtoKey,
      githubToken,
      branch,
      useConventionalCommits,
      dryRun
    });

    const json = JSON.stringify(output, null, 2);
    core.debug('Output result_json:\n' + json);
    core.setOutput('result_json', json);

    const table = showResultsTable(output);
    core.debug('Output result_table:\n' + table);
    core.setOutput('result_table', table);
  } catch (error) {
    core.setFailed(error.toString());
  }
}

// TODO: export from CLI
function showResultsTable(results) {
  const rows = results.map((r) => [r.status, r.publishedStatus, r.title]);
  const usedWidth = 27; // Status columns + padding
  const availableWidth = 80;
  const maxTitleWidth = Math.max(availableWidth - usedWidth, 8);

  return table(rows, {
    drawHorizontalLine: () => false,
    border: getBorderCharacters('void'),
    columnDefault: { paddingLeft: 0, paddingRight: 1 },
    columns: { 2: { truncate: maxTitleWidth, width: maxTitleWidth } }
  }).slice(0, -1);
}

run();
