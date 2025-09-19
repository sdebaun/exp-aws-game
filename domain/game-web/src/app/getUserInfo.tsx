import { AccountEntity, DemenseEntity } from "@/db/entities";
import { User } from "@auth0/nextjs-auth0/types";
import { auth0 } from "../../../../integrations/auth0";


export async function getUserInfo() {
  // this should get the auth0 session & user
  const session = await auth0.getSession();
  if (!session) return { user: null, account: null, demense: null };

  const user = session.user;
  const account = await accountFromUser(user);
  
  // Check if user has a demense
  const demenseResult = await DemenseEntity.query
    .primary({ accountId: user.sub })
    .go();
  const demense = demenseResult.data[0] || null;
  
  return { user, account, demense };
}

async function accountFromUser(user: User) {
  // Try to get existing account
  const existing = await AccountEntity.get({ accountId: user.sub }).go();
  if (existing.data) {
    return existing.data;
  }

  // Create new account with starter ink
  const created = await AccountEntity.create({ accountId: user.sub }).go();
  return created.data;
}
