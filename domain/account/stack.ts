export default function stack(
  { bus, router, auth }: {
    bus: sst.aws.Bus;
    router: sst.aws.Router;
    auth: sst.aws.Auth;
  },
) {
  const accountWebUser = new sst.aws.Nextjs("accountWebUser", {
    link: [bus],
    path: "domain/account/account-web-user",
  });

  const accountWebAdmin = new sst.aws.Nextjs("accountWebAdmin", {
    link: [bus],
    path: "domain/account/account-web-admin",
  });

  return { accountWebUser, accountWebAdmin };
}
