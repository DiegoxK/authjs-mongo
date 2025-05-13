import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.collection("posts").insertOne({
        name: input.name,
        createdAt: new Date(),
        userId: ctx.session.user.id,
      });

      return {
        id: result.insertedId,
        name: input.name,
      };
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    return post[0] ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
