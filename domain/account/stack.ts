export default function stack({ bus }: { bus: sst.aws.Bus }) {
  const accountWebUser = new sst.aws.Nextjs("accountWebUser", {
    link: [bus],
    path: "domain/account/webUser",
  });

  const accountWebAdmin = new sst.aws.Nextjs("accountWebAdmin", {
    link: [bus],
    path: "domain/account/webAdmin",
  });

  return { accountWebUser, accountWebAdmin };
}
