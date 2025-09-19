"use server";

import { redirect } from "next/navigation";
import { getUserInfo } from "./getUserInfo";
import { DemenseEntity, AccountEntity } from "../db/entities";

export async function destroyDemense() {
  const { user, demense } = await getUserInfo();
  
  if (!user || !demense) {
    throw new Error("No demense to destroy");
  }
  
  // Delete the demense
  await DemenseEntity.delete({
    accountId: user.sub,
    demenseId: demense.demenseId,
  }).go();
  
  // Redirect to demense selection
  redirect('/demense/new');
}

export async function addInk() {
  const { user, account } = await getUserInfo();
  
  if (!user || !account) {
    throw new Error("Not authenticated");
  }
  
  // Update the ink amount
  const currentInk = account.ink || 0;
  await AccountEntity.update({
    accountId: user.sub,
  })
  .set({ ink: currentInk + 1000 })
  .go();
  
  // Refresh the page to show updated ink
  redirect('/');
}

export async function destroyAccount() {
  const { user, demense } = await getUserInfo();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const accountId = user.sub;
  
  // Delete demense if exists
  if (demense) {
    await DemenseEntity.delete({
      accountId,
      demenseId: demense.demenseId,
    }).go();
  }
  
  // Delete account
  await AccountEntity.delete({
    accountId,
  }).go();
  
  // Log out
  redirect('/auth/logout');
}