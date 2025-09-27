import { AccountEntity } from "@/db/entities";
import { User } from "@auth0/nextjs-auth0/types";
import { getAuth0Client } from "../../../../integrations/auth0";


export async function getUserInfo() {
  // this should get the auth0 session & user
  const auth0 = await getAuth0Client();
  const session = await auth0.getSession();
  if (!session) return { user: null, account: null };

  const user = session.user;
  const account = await accountFromUser(user);
  
  return { user, account };
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