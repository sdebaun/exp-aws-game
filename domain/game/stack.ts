export default function stack({ bus }: { bus: sst.aws.Bus }) {
  const gameWebUser = new sst.aws.Nextjs("gameWebUser", {
    link: [bus],
    path: "domain/game/webUser",
  });

  const gameWebAdmin = new sst.aws.Nextjs("gameWebAdmin", {
    link: [bus],
    path: "domain/game/webAdmin",
  });

  return { gameWebUser, gameWebAdmin };
}
