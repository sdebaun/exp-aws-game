"use server";

import { redirect } from "next/navigation";
import { getUserInfo } from "./getUserInfo";
import { DemenseEntity } from "../db/entities";

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