import { Resource } from "sst";
import { realtime } from "sst/aws/realtime";

export const handler = realtime.authorizer(async (token) => {
  // For this spike, we'll allow all connections
  // In production, you'd validate the token here
  console.log("Authorizing realtime connection with token:", token);
  
  // Allow publishing and subscribing to all topics under our app/stage namespace
  const prefix = `${Resource.App.name}/${Resource.App.stage}`;
  
  return {
    publish: [`${prefix}/chat/*`],
    subscribe: [`${prefix}/chat/*`],
  };
});