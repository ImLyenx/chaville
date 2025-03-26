"use server";

import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getEnterprisesByUserIds(userIds: string[]) {
  const enterprises = await db
    .select()
    .from(entreprise)
    .where(inArray(entreprise.userId, userIds));

  const userEnterprisesMap = new Map();
  enterprises.forEach((enterprise) => {
    const userId = enterprise.userId;
    if (!userEnterprisesMap.has(userId)) {
      userEnterprisesMap.set(userId, []);
    }
    userEnterprisesMap.get(userId).push(enterprise);
  });

  return userEnterprisesMap;
}

export async function updateEnterpriseValidation(
  id: string,
  isValidated: boolean
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.role || session.user.role !== "admin") {
    throw new Error("Unauthorized: Only admins can validate enterprises");
  }

  await db.update(entreprise).set({ isValidated }).where(eq(entreprise.id, id));

  const updatedEnterprise = await db
    .select()
    .from(entreprise)
    .where(eq(entreprise.id, id))
    .then((res) => res[0]);

  if (!updatedEnterprise) {
    throw new Error("Enterprise not found");
  }

  return updatedEnterprise;
}
