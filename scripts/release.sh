#!/bin/bash

# parse arguments
for i in "$@"
do
case $i in
    --dry-run)
    DRY_RUN=true
    shift # past argument with no value
    ;;
    *)
          # unknown option
    ;;
esac
done

# declare some variables
git fetch
GIT_STATUS=$(git status --short --untracked-files=no)
HEAD_HASH=$(git rev-parse HEAD)
CURRENT_HASH=$(git rev-parse @{u})
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
RELEASE_TYPE=0
JQ_INSTALL_PATH=$(which jq)

cat << EOF
================================
eslint-plugin-svelte-custom-element release script
================================

EOF

# exit if not on master branch
if [ "$BRANCH_NAME" != "master" ]; then
  echo "ERROR - Not allowed to release from any other branch than master"
  exit 1
fi

# make sure you have the latest changes
if [ "$GIT_STATUS" != "" ] ; then
  echo "ERROR - Head not clean, run git pull or git stash to update/clean before releasing."
  echo "git status: $GIT_STATUS"
  echo "head hash: $HEAD_HASH"
  echo "curr hash: $CURRENT_HASH"
  exit 1
fi

if [ "$JQ_INSTALL_PATH" == "" ] ; then
  echo "jq must be installed in order to run this script."
  echo "Installation instructions: https://stedolan.github.io/jq/download/"
  exit 1;
fi

cat << EOF
Select release type:
  major - breaking changes
  minor - added functionality
  patch - minor fixes
EOF

# select type of release
while [[ "$RELEASE_TYPE" != "major" && "$RELEASE_TYPE" != "minor" && "$RELEASE_TYPE" != "patch" && "$RELEASE_TYPE" != "" ]]; do
    echo -e $ERROR_MESSAGE
    read -p "Type of release: (patch) " RELEASE_TYPE
    ERROR_MESSAGE="'$RELEASE_TYPE' is not a valid value. Try again"
done
# default to patch
RELEASE_TYPE=${RELEASE_TYPE:-patch}

if [ "$DRY_RUN" = true ] ; then
  echo "--dry-run, exiting."
  exit 0;
fi

echo -e "\nCreating $RELEASE_TYPE release"

# to delete unwanted tag: git tag -d tagName
# undo last commit: git reset --hard HEAD^
npm --no-git-tag-version version $RELEASE_TYPE
NEW_PKG_VERSION=$(cat package.json | jq --raw-output '.version')
echo "publishing $NEW_PKG_VERSION"
git add package.json && git commit -m $NEW_PKG_VERSION

# push it
git push --no-verify

echo "Success"
