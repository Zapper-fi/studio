Thank you for investing your time in contributing to our project!

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## Setup the Project

The following steps will get you up and running to building your app within Studio:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/Zapper-fi/studio))

2. Clone your fork locally

```sh
git clone https://github.com/<your_github_username>/studio.git
cd studio
```

3. Install or update to **Node.js v16**.

4. Ensure you are using [pnpm](https://pnpm.io/) to install dependencies

5. Create a working branch and buidl!

## Making Changes

### Commit your update

Commit the changes once you are happy with them. In order to help with reviews, ensure your commit messages are atomic
and accurately represents the changes you wish to bring in.

Please follow the commit convention as detailed in the section below [🔗](./CONTRIBUTING.md#commit-convention).

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the "Ready for review" template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a Zapper team member will review your proposal. We may ask questions or request for additional information.
- We may ask for changes to be made before a PR can be merged. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) to help you resolve merge conflicts and other issues.

When submitting a PR, please ensure the nature of the change is writting in the PR title. For example,
if a new feature has been added, the title should be `(feat) My new feature`.

If multiple changes are included in a PR, you may append multiple identifiers. For example,
`(feat/test) My new feature and additional tests`.

## Development

To improve your development process, we've set up some helpful tools and systems. Studio has a CLI
to help you bootstrap a new application or to edit an existing one.

### Studio CLI

The included CLI can help you automate some boiler plate heavy tasks.

You can invoke the CLI at anytime by using:

```
pnpm studio
```

## Think you found a bug?

Please conform to the issue template and provide a clear path to reproduction
with a code example.

## Proposing new or changed API?

Please provide thoughtful comments and some sample API code. Proposals that
don't line up with our roadmap or don't have a thoughtful explanation will be
closed.

## Found a typo or want to contribute to the docs?

Head to the [documentation repo](https://github.com/Zapper-fi/studio-docs) and open a PR against
that repo.

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: any changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/
