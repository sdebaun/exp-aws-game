/**
 * The integration domain is for resources that are used
 * by many other domains to talk to each other.
 */
export default function stack() {
  // the event bus is published and subscribed to by
  // many other domains that need to talk to each other
  const bus = new sst.aws.Bus("bus");

  // the router is used to combine multiple
  // internal and external endpoints (eg nextjs apps)
  // into a single public-facing endpoint
  // const router = new sst.aws.Router("router", {
  //   // domain: "foo.com"
  // });

  // const waf = new aws.wafv2.WebAcl("webAcl", {
  //   defaultAction: {
  //     allow: {},
  //   },
  //   scope: "CLOUDFRONT",
  //   visibilityConfig: {
  //     cloudwatchMetricsEnabled: true,
  //     metricName: "webAclMetric",
  //     sampledRequestsEnabled: true,
  //   },
  //   rules: [],
  // });

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
  //     resourceArn: router.nodes.cdn.nodes.distribution.arn,
  //     webAclArn: waf.arn,
  //   },
  // );

  return { bus };
}
