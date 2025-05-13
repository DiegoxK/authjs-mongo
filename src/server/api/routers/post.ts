import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { PostSchema } from "@/server/db/schema";

type Post = z.infer<typeof PostSchema>;

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(PostSchema.omit({ _id: true, createdAt: true, userId: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.collection<Post>("posts").insertOne({
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
      .collection<Post>("posts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    return {
      name: post[0]?.name,
    };
  }),

  getAllByUser: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db
      .collection<Post>("posts")
      .find({ userId: ctx.session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return posts;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
