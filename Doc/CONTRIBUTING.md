# Contributing to Treasure Hunters

First off, thank you for considering contributing to **Treasure Hunters**! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) tab to see if someone else has already created a ticket. If not, go ahead and make one!

## 2. Fork & create a branch

If this is something you think you can fix, then [fork](https://help.github.com/articles/fork-a-repo) the repository and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```bash
git checkout -b 325-add-water-level
```

## 3. Implementation Guidelines

### Code Style
- We use standard ES6 JavaScript.
- Please keep your code clean and add comments where complex logic (like physics or collision checks) is introduced.

### Asset Guidelines
- All new images must be placed in `public/assets/` under their respective folders.
- Ensure sprite sheets have dimensions cleanly divisible by their frame sizes (e.g., 32x32 frames).
- Compress your images before committing to save bandwidth.

## 4. Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the main repository's master branch.

```bash
git remote add upstream https://github.com/username/treasure-hunters.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout 325-add-water-level
git rebase master
git push --set-upstream origin 325-add-water-level
```

Finally, go to GitHub and create a Pull Request to the main repository.

## 5. Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Please format your commit messages accordingly:

- `feat:` (new feature for the user, not a new feature for build script)
- `fix:` (bug fix for the user, not a fix to a build script)
- `docs:` (changes to the documentation)
- `style:` (formatting, missing semi colons, etc; no production code change)
- `refactor:` (refactoring production code, eg. renaming a variable)
- `test:` (adding missing tests, refactoring tests; no production code change)
- `chore:` (updating grunt tasks etc; no production code change)
