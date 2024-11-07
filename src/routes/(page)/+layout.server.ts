import { authenticateSessionToken } from "$lib/server/auth";
import prisma from "$lib/server/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const { userID, error } = await authenticateSessionToken(
    cookies.get("session")
  );

  const user =
    userID === undefined
      ? null
      : await prisma.user.findFirst({
          where: {
            id: userID,
          },
        });

  return {
    loggedIn: error === undefined,
    userID: userID as string,
    nickname: user?.nickname ?? null,
    profilePicture: user?.profilePicture ?? null,
  };
};
