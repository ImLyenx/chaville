"use server";

import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";

export async function getEnterprisesByUserIds(userIds: string[]) {
  try {
    const enterprises = await db
      .select()
      .from(entreprise)
      .where(
        // Using in operator to fetch all enterprises in one query
        userIds.length > 0
          ? inArray(entreprise.userId, userIds)
          : eq(entreprise.userId, "") // Fallback for empty array
      );

    // Create a map of userId to enterprise for easier lookup
    const enterpriseMap = enterprises.reduce((acc, curr) => {
      acc[curr.userId] = curr;
      return acc;
    }, {} as Record<string, typeof entreprise.$inferSelect>);

    return enterpriseMap;
  } catch (error) {
    console.error("Error fetching enterprises:", error);
    return {};
  }
}

export async function updateEnterpriseValidation(
  enterpriseId: string,
  isValidated: boolean
) {
  try {
    await db
      .update(entreprise)
      .set({ isValidated })
      .where(eq(entreprise.id, enterpriseId));
    return { success: true };
  } catch (error) {
    console.error("Error updating enterprise validation:", error);
    return { success: false };
  }
}
