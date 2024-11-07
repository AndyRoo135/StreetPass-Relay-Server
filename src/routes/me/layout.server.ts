import { authenticateSessionToken } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const { freshLogin, userID, sessionID } = await authenticateSessionToken(
    cookies.get("session")
  );
  if (freshLogin !== true)
    throw redirect(307, `/login?r=${encodeURIComponent(url.pathname)}`);

  const { profilePicture, nickname } = await prisma.user.findUniqueOrThrow({
    where: { id: userID },
  });

  return {
    sessionID,
    userID,
    profilePicture,
    nickname,
  };
};
