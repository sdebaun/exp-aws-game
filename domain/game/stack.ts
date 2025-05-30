export default function stack({ bus }: { bus: sst.aws.Bus }) {
  const gameWebUser = new sst.aws.Nextjs("gameWebUser", {
    link: [bus],
    path: "domain/game/game-web-user",
  });

  const gameWebAdmin = new sst.aws.Nextjs("gameWebAdmin", {
    link: [bus],
    path: "domain/game/game-web-admin",
  });
}
