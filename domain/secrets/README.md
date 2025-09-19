# Secrets

All secrets -- anything that should be typically passed as an env var -- should live in domain/secrets.  99% of the time, they should be referenced in app code as an SST resource.  Don't be a dick and pass around env vars.

## One Exception: Nextjs Middleware

As far as we can tell, sst resources dont play in nextjs middleware.  We have to pass them as env vars?  Fuck me.