export default function stack(
  { bus, router }: { bus: sst.aws.Bus; router: sst.aws.Router },
) {
  const gameWebUser = new sst.aws.Nextjs("gameWebUser", {
    link: [bus],
    path: "domain/game/game-web-user",
    router: { instance: router, path: "/game" },
  });
  // router.route("/game", gameWebUser.url);
  // console.log("**************************************************");
  // console.log(
  //   "URN",
  //   $interpolate`${gameWebUser.urn}`,
  // );
  // console.log(
  //   "gamewebuser server.arn",
  //   $interpolate`${gameWebUser.nodes.server.arn}`,
  // );
  // console.log(
  //   "gamewebuser cdn.distribution.arn",
  //   $interpolate`${gameWebUser.nodes.cdn.nodes.distribution.arn}`,
  // );

  // the game web admin is used to manage the game
  // and is only accessible to the game admin
  const gameWebAdmin = new sst.aws.Nextjs("gameWebAdmin", {
    link: [bus],
    path: "domain/game/game-web-admin",
    router: { instance: router, path: "/game-admin" },
  });
  // router.route("/game-admin", gameWebAdmin.url);
  return { gameWebAdmin, gameWebUser };
}
