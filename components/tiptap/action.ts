"use server";

import { db } from "@/lib/db";
import { blog } from "@/lib/schema";

export const publishPost = async (html: string) => {
  console.log(html);
  const post = await db.insert(blog).values({
    content: html,
    title: "test",
    isWrittenByAdmin: true,
  });
  console.log(post);
};
