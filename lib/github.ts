import ky from "ky";

const getAvatarUrlForUser = (username: string) =>
  `https://github.com/${username}.png`;

const extractDetailsFromRepoUrl = (repoUrl: string) => {
  const repoUrlParts = repoUrl.split("/");
  const owner = repoUrlParts[repoUrlParts.length - 2];
  const repoName = repoUrlParts[repoUrlParts.length - 1];
  return { owner, repoName };
};

async function getUsername(authHeader: string) {
  if (!authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }

  const user: any = await ky
    .get("https://api.github.com/user", {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .json();
  return user.login;
}

export { getAvatarUrlForUser, extractDetailsFromRepoUrl, getUsername };
