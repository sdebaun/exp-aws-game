// export default function stack({
//   // accountWebAdmin,
//   // accountWebUser,
//   // gameWebAdmin,
//   // gameWebUser,
// }: {
//   // accountWebAdmin: sst.aws.Nextjs;
//   // accountWebUser: sst.aws.Nextjs;
//   // gameWebAdmin: sst.aws.Nextjs;
//   // gameWebUser: sst.aws.Nextjs;
// }) {
// the router is used to combine multiple
// internal and external endpoints (eg nextjs apps)
// into a single public-facing endpoint
export default function stack() {
  const auth = new sst.aws.Auth("auth", {
    issuer: "auth/src/issuer.handler",
  });

  const router = new sst.aws.Router("router", {
    // domain: "foo.com"
  });

  const waf = new aws.wafv2.WebAcl("webAcl", {
    defaultAction: {
      allow: {},
    },
    scope: "CLOUDFRONT",
    visibilityConfig: {
      cloudwatchMetricsEnabled: true,
      metricName: "webAclMetric",
      sampledRequestsEnabled: true,
    },
    rules: [],
  });

  // console.log("***********");
  // console.log(
  //   "router.nodes.cdn.nodes.distribution.arn",
  //   $jsonParse(router.nodes.cdn.nodes.distribution.arn),
  // );
  // console.log("***********");

  // currently disabled because i cant figure out how to get the arn of the router
  // const webAclAssociation = new aws.wafv2.WebAclAssociation(
  //   "webAclAssociation",
  //   {
  //     // resourceArn: router.nodes.cdn.nodes.distribution.arn,
  //     resourceArn: accountWebAdmin.nodes.server.arn,
  //     webAclArn: waf.arn,
  //   },
  // );

  return { router, auth };
}
