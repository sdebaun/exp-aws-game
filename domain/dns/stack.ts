// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

/**
 * DNS and domain configuration for riverofsouls.net
 *
 * Stage-specific domains:
 * - production: riverofsouls.net
 * - dev: dev.riverofsouls.net
 * - personal stages: {stage}.riverofsouls.net (e.g., sdebaun.riverofsouls.net)
 */
export default function DnsStack() {
  const stage = $app.stage;
  const rootDomain = "riverofsouls.net";

  // Determine domain based on stage
  const domain = stage === "production"
    ? rootDomain
    : `${stage}.${rootDomain}`;

  // Get the Route53 hosted zone (must already exist)
  // You created this in Route53 console when you registered the domain
  const zone = aws.route53.getZoneOutput({
    name: rootDomain,
  });

  // CloudFront requires ACM certificates in us-east-1
  // Create a provider for that region
  const usEast1Provider = new aws.Provider("UsEast1Provider", {
    region: "us-east-1",
  });

  // Create ACM certificate in us-east-1 (required for CloudFront)
  // This covers both the root domain and all subdomains
  const cert = new aws.acm.Certificate(
    "Certificate",
    {
      domainName: rootDomain,
      subjectAlternativeNames: [`*.${rootDomain}`],
      validationMethod: "DNS",
    },
    { provider: usEast1Provider }
  );

  // Create DNS validation records for the certificate
  // ACM provides validation options that we need to add to Route53
  const validationRecords = cert.domainValidationOptions.apply((opts) =>
    opts.map((opt, index) => {
      return new aws.route53.Record(`ValidationRecord${index}`, {
        zoneId: zone.zoneId,
        name: opt.resourceRecordName!,
        type: opt.resourceRecordType!,
        records: [opt.resourceRecordValue!],
        ttl: 60,
        allowOverwrite: true,
      });
    })
  );

  // Wait for certificate validation to complete
  const certValidation = new aws.acm.CertificateValidation(
    "CertificateValidation",
    {
      certificateArn: cert.arn,
      validationRecordFqdns: validationRecords.apply((records) =>
        records.map((r) => r.fqdn)
      ),
    },
    { provider: usEast1Provider }
  );

  return {
    domain,
    zone,
    cert: certValidation.certificateArn,
  };
}
