const getAvatarUrlForUser = (username: string) =>
  `https://github.com/${username}.png`;

const extractDetailsFromRepoUrl = (repoUrl: string) => {
  const repoUrlParts = repoUrl.split("/");
  const owner = repoUrlParts[repoUrlParts.length - 2];
  const repoName = repoUrlParts[repoUrlParts.length - 1];
  return { owner, repoName };
};

const getRepoFromProjectTitle = (title: string) =>
  title.toLowerCase().replace(/\s/g, "-");

export {
  getAvatarUrlForUser,
  extractDetailsFromRepoUrl,
  getRepoFromProjectTitle,
};
