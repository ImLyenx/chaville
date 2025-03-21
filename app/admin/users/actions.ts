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
    const response = await fetch(`/api/enterprise/validate/${enterpriseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isValidated }),
    });

    if (!response.ok) {
      throw new Error("Failed to update validation status");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating enterprise validation:", error);
    return { success: false };
  }
}
