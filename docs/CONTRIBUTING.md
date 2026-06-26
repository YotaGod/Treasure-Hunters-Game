# Contributing to Treasure Hunters

First off, thank you for considering contributing to Treasure Hunters! It's people like you that make Treasure Hunters such a great game.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Treasure Hunters and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):
`git checkout -b 325-add-new-enemy-type`

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first. 

## Get the style right

Your patch should follow the same conventions & formatting as the rest of the project.
- Use ES6 syntax.
- Ensure your code does not throw errors during gameplay.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Treasure Hunters's master branch:
```bash
git remote add upstream https://github.com/username/treasure-hunters.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!
```bash
git checkout 325-add-new-enemy-type
git rebase master
git push --set-upstream origin 325-add-new-enemy-type
```

Finally, go to GitHub and make a Pull Request.

## Multi-Language Documentation

If you are modifying documentation, please make sure to update both the English and Indonesian versions if applicable.
