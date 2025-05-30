export default function stack({ bus }: { bus: sst.aws.Bus }) {
  const accountWebUser = new sst.aws.Nextjs("accountWebUser", {
    link: [bus],
    path: "domain/account/account-web-user",
  });

  const accountWebAdmin = new sst.aws.Nextjs("accountWebAdmin", {
    link: [bus],
    path: "domain/account/account-web-admin",
  });
}
