const getAvatarUrlForUser = (username: string) =>
  `https://github.com/${username}.png`;

const extractDetailsFromRepoUrl = (repoUrl: string) => {
  const repoUrlParts = repoUrl.split("/");
  const owner = repoUrlParts[repoUrlParts.length - 2];
  const repoName = repoUrlParts[repoUrlParts.length - 1];
  return { owner, repoName };
};

export { getAvatarUrlForUser, extractDetailsFromRepoUrl };
