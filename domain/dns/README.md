# DNS Domain

Manages DNS and SSL certificates for `riverofsouls.net`.

## How It Works

### Stage-Based Domains

Each SST stage gets its own subdomain:

- `sst deploy --stage production` → **riverofsouls.net**
- `sst deploy --stage dev` → **dev.riverofsouls.net**
- `sst deploy --stage alice` → **alice.riverofsouls.net**

This means:
- No more dev/deploy collisions (different domains = different CloudFront distributions)
- Each developer can have their own persistent sandbox
- Clear separation between environments

### SSL Certificate

A single wildcard certificate covers all stages:
- `riverofsouls.net` (root domain)
- `*.riverofsouls.net` (all subdomains)

**Certificate validation** happens automatically via DNS during first deploy:
- SST creates validation records in Route53
- AWS verifies ownership
- Takes ~5-10 minutes on first run
- Certificate lives forever after that

**Important:** The cert MUST be in `us-east-1` (AWS CloudFront requirement).

## First-Time Setup

### Prerequisites

1. **Domain registered in Route53:** `riverofsouls.net` must be registered
2. **Hosted zone exists:** Created automatically when you register the domain
3. **Wait for registration to complete:** Can take 15-30 minutes

### Initial Deploy

Once the domain registration completes:

```bash
sst deploy --stage dev
```

This will:
1. Find your Route53 hosted zone
2. Create ACM certificate for `*.riverofsouls.net`
3. Add DNS validation records
4. Wait for AWS to validate the cert (~5-10 min)
5. Create CloudFront distribution with SSL
6. Add Route53 A record pointing `dev.riverofsouls.net` → CloudFront

**First deploy is slow** (~10-15 minutes total). Subsequent deploys are much faster (~2-5 minutes).

### Deploy Other Stages

```bash
# Production (bare domain)
sst deploy --stage production  # → riverofsouls.net

# Personal sandbox
sst deploy --stage alice       # → alice.riverofsouls.net
```

Each stage uses the same certificate but gets its own:
- CloudFront distribution
- Route53 DNS record
- Lambda functions
- DynamoDB tables

## Auth0 Configuration

After deploying a new stage, update Auth0 with the new callback URLs:

1. Go to Auth0 Dashboard → Applications → Your App
2. Add to **Allowed Callback URLs:**
   ```
   https://dev.riverofsouls.net/api/auth/callback
   ```
3. Add to **Allowed Logout URLs:**
   ```
   https://dev.riverofsouls.net
   ```
4. Update the stage's secrets:
   ```bash
   sst secret set auth0_APP_BASE_URL https://dev.riverofsouls.net --stage dev
   ```

Repeat for each stage you deploy.

## Development Workflow

### Option 1: Local Dev (Recommended)

```bash
# Terminal 1: Run SST infrastructure
sst dev --stage alice  # Uses alice.riverofsouls.net for AWS resources

# Terminal 2: Run Next.js locally
cd domain/game-web
yarn dev

# Access at http://localhost:3000
```

This bypasses CloudFront entirely. Fast, with hot reload.

### Option 2: Full Deploy

```bash
sst deploy --stage alice
# Access at https://alice.riverofsouls.net
```

Slower (~2-5 min), but tests the real production-like setup.

## Troubleshooting

### "Hosted zone not found"

The domain registration isn't complete yet. Wait for the Route53 registration to finish (check the console).

### Certificate validation stuck

Check Route53 for the validation records. They should appear automatically. If not:
1. Check CloudFormation events in AWS Console
2. Look for ACM certificate validation errors
3. Worst case: delete the certificate resource and redeploy

### CloudFront still showing old domain

CloudFront caching. Either:
- Wait 5-10 minutes for DNS propagation
- Invalidate CloudFront cache (costs $0.005)
- Use incognito/private browsing

### Auth0 redirect failing

Update the callback URLs in Auth0 dashboard (see above).

## Cost Breakdown

- **Route53 Hosted Zone:** $0.50/month
- **ACM Certificate:** FREE
- **Route53 DNS Queries:** ~$0.40/million queries (pennies)
- **CloudFront:** Pay-as-you-go (minimal for dev stages)

Total cost for multiple dev stages: ~$1-2/month.
