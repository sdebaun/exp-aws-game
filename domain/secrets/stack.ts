// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

export type SecretsGroupName = "auth0" | "openai";
export type SecretsGroup = Record<string, sst.Secret>;
export type Secrets = Record<SecretsGroupName, SecretsGroup>;

export default function (): Secrets {
  // these secret values are the *fallback* values if none is set
  // they are *not* production values, they are for sandboxes or dev environments.
  return {
    auth0: {
      AUTH0_SECRET: new sst.Secret(
        "auth0_AUTH0_SECRET",
        "654c8f68365b2fb70bea904e08afd85775df92f7be3ad83e5bd68a739beed523",
      ),
      APP_BASE_URL: new sst.Secret(
        "auth0_APP_BASE_URL",
        "http://localhost:3000",
      ),
      AUTH0_DOMAIN: new sst.Secret(
        "auth0_AUTH0_DOMAIN",
        "dev-fwbtnyrpknay4lae.us.auth0.com",
      ),
      AUTH0_CLIENT_ID: new sst.Secret(
        "auth0_AUTH0_CLIENT_ID",
        "BiL22iHrTfZkAHExUeU2a6j88vkvwmYT",
      ),
      AUTH0_CLIENT_SECRET: new sst.Secret(
        "auth0_AUTH0_CLIENT_SECRET",
        "M2uFbVmkTveG3fwD5XvkQSpcGblfCamQYetCr56FyTqrblb2dWm3RcA5IPo2Ieus",
      ),
    },
    openai: {
      OPENAI_API_KEY: new sst.Secret(
        "openai_OPENAI_API_KEY",
        "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",
      ),
    },
  };
}

//   const secrets = {
//     auth0: {
//       AUTH0_SECRET: 'use [openssl rand -hex 32] to generate a 32 bytes value',
//       APP_BASE_URL: 'http://localhost:3000',
//       AUTH0_DOMAIN: 'https://dev-fwbtnyrpknay4lae.us.auth0.com',
//       AUTH0_CLIENT_ID: 'BiL22iHrTfZkAHExUeU2a6j88vkvwmYT',
//       AUTH0_CLIENT_SECRET: 'M2uFbVmkTveG3fwD5XvkQSpcGblfCamQYetCr56FyTqrblb2dWm3RcA5IPo2Ieus',
// // # 'If your application is API authorized add the variables AUTH0_AUDIENCE and AUTH0_SCOPE'
// // AUTH0_AUDIENCE='your_auth_api_identifier'
// // AUTH0_SCOPE='openid profile email read:shows'
//     }
//   }
// const web = new sst.aws.Nextjs("GameWeb", {
//   path: "domain/game-web",
// });

// return {
//   gameWeb: web,
//   url: web.url,
// };
