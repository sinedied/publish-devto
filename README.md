# :postbox: publish-devto

[![Build Status](https://github.com/sinedied/publish-devto/workflows/build/badge.svg)](https://github.com/sinedied/publish-devto/actions)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> GitHub Action to publish markdown files as articles on [dev.to](https://dev.to) platform, with assets hosted on GitHub.

## Usage

See [action.yml](action.yml).

```yaml
steps:
- uses: actions/checkout@v7
- name: Publish articles on dev.to
  uses: sinedied/publish-devto@v2
  with:
    # Your dev.to personal API key to publish and update articles.
    # See https://docs.dev.to/api/#section/Authentication/api_key
    devto_key: ${{ secrets.DEVTO_TOKEN }}
    # Your GitHub token, used to create commits for updated files.
    # For a personal access token, create a secret named GH_TOKEN because
    # custom secret names cannot start with GITHUB_.
    # The built-in secrets.GITHUB_TOKEN can also be used when it has
    # contents: write permission and branch protection rules allow it.
    # See https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
    github_token: ${{ secrets.GH_TOKEN }}
    # (Optional) The files to publish. Default is "posts/**/*.md"
    files: 'posts/**/*.md'
    # (Optional) The git branch to use. Default is 'main'.
    branch: main
    # (Optional) Use conventional commit messages. Default is false.
    # See https://www.conventionalcommits.org. 
    conventional_commits: true
    # (Optional) Do not make actual changes on dev.to.
    dry_run: false
```

You can use [this template repository](https://github.com/sinedied/devto-github-template) as an example setup.

## Using a custom committer

You can specify who you want to appear in the commits made by this action by adding these environment variables to the action:

```yaml
  env:
    GIT_COMMITTER_NAME: your_name
    GIT_COMMITTER_EMAIL: your@email.com
```

## How does it work?

This github action delegates most of the work to the [devto-cli](https://github.com/sinedied/devto-cli) push command.

You can find more information about how it works in the [CLI readme](https://github.com/sinedied/devto-cli).

## Releasing (maintainers)

1. Merge the release commit to `main` and confirm the build workflow passes.
2. Run the **release** workflow from `main` and enter a new version matching `v2.x.y`.
3. Confirm that the immutable version tag, GitHub Release, and floating `v2` tag point to the intended commit.

The workflow verifies that `action.yml` uses the Node 24 runtime and that rebuilding `dist` produces no changes. It creates the immutable `v2.x.y` tag without replacing an existing tag, creates or updates its GitHub Release, and only then moves the `v2` alias without deleting it first. A failed workflow can be rerun with the same version only when that tag already points to the same commit.

Consumers should use `sinedied/publish-devto@v2` for automatic compatible updates or pin an immutable `v2.x.y` tag for reproducibility. Do not use `main` as a stable reference: it can contain changes that have not completed the release checks.
