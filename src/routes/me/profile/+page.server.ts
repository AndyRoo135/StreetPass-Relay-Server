import {
  authenticateSessionToken,
  recoverEmailURI,
  tokenKey,
  verifyEmailURI,
} from "$lib/server/auth";
import {
  changeEmailHTML,
  changeEmailText,
  recoverEmailHTML,
  recoverEmailText,
  recoveryEmailAddress,
  resend,
  verificationEmailAddress,
  verifyEmailHTML,
  verifyEmailText,
} from "$lib/server/email";
import prisma from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { SignJWT } from "jose";
import { DateTime } from "luxon";
import { compare, hash } from "bcrypt";

export const load: PageServerLoad = async ({ parent }) => {
  const { userID } = await parent();
  const { email, emailVerified, bio, emailVerificationSent } =
    await prisma.user.findUniqueOrThrow({
      where: { id: userID },
    });

  const canSendVerification =
    emailVerificationSent === null ||
    DateTime.fromJSDate(emailVerificationSent).diffNow().as("minutes") <= -15;
  const canSendVerificationAgain = !canSendVerification
    ? Math.floor(
        15 + DateTime.fromJSDate(emailVerificationSent).diffNow().as("minutes")
      )
    : 0;

  return {
    email: email.replace(/(?<=^.).*(?=@)/, "*****"),
    emailVerified,
    bio,
    canSendVerification,
    canSendVerificationAgain,
    // todo profile visibility
  };
};

export const actions: Actions = {
  updateBio: async ({ cookies, request }) => {
    const {
      error: authError,
      userID,
      freshLogin,
    } = await authenticateSessionToken(cookies.get("session"));

    if (authError || !freshLogin)
      return fail(401, { bio: "Please log in again." });

    const formData = await request.formData();
    const bio = formData.get("bio") as string;

    if (!bio || typeof bio !== "string") return fail(400);

    if (bio.length > 200)
      return fail(400, { bio: "Cannot be longer than 200 characters" });

    const success = await prisma.user
      .update({
        where: {
          id: userID,
        },
        data: {
          bio,
        },
      })
      .then(
        () => true,
        () => false
      );

    return { bio: success ? true : "Could not save, try again later" };
  },
  resendEmailVerification: async ({ cookies, url }) => {
    const { userID, freshLogin } = await authenticateSessionToken(
      cookies.get("session")
    );
    if (freshLogin !== true) return fail(401);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userID,
      },
    });
    if (user.emailVerified) return fail(400);

    if (
      user.emailVerificationSent !== null &&
      DateTime.fromJSDate(user.emailVerificationSent).diffNow().as("minutes") >
        -15
    )
      return fail(400, { resendVerification: false });

    const token = await new SignJWT({
      aud: verifyEmailURI,
      sub: user.id,
      exp: DateTime.now().plus({ minutes: 10 }).toSeconds(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(tokenKey);

    const result = await resend.emails.create({
      from: verificationEmailAddress,
      to: user.email,
      subject: "Verify your StreetRelay Email",
      text: verifyEmailText(user.id, url.origin, token),
      html: verifyEmailHTML(user.id, url.origin, token),
    });

    if (result.error) {
      console.error(result.error);
      return { resendVerification: false };
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationSent: new Date(),
      },
    });
    return {
      toast:
        "A new verification email has been sent. Check your inbox and spam folders.",
    };
  },
  changeEmail: async ({ request, cookies, url }) => {
    const formData = await request.formData();
    const password = formData.get("password") as string;
    const newEmail = formData.get("email") as string;

    // make sure all fields were sent
    if (!password || !newEmail)
      return fail(400, {
        password: !password ? "Please enter your password" : null,
        email: !newEmail ? "Please enter an email address" : null,
      });

    if (!newEmail.match(/^.+@.+\.(?:.){2,6}$/))
      return fail(400, {
        email: "Please provide a valid email address",
      });

    const {
      error: authError,
      freshLogin,
      userID,
    } = await authenticateSessionToken(cookies.get("session"));
    if (authError || !freshLogin) return fail(401);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userID,
      },
    });

    if (!(await compare(password, user.password))) {
      return fail(400, { password: "Incorrect password" });
    }

    if (newEmail === user.email) return {};
    // todo rate limit email changes

    const now = DateTime.now().startOf("second");

    // send recovery email to previous email address
    if (user.emailVerified) {
      const recoverEmailToken = await new SignJWT({
        aud: recoverEmailURI,
        sub: user.id,
        exp: now.plus({ days: 30 }).toSeconds(),
        email: user.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .sign(tokenKey);

      const recoverEmailResponse = await resend.emails.send({
        from: recoveryEmailAddress,
        to: user.email,
        subject: "StreetRelay Email Change",
        text: recoverEmailText(user.id, url.origin, recoverEmailToken),
        html: recoverEmailHTML(user.id, url.origin, recoverEmailToken),
      });

      if (recoverEmailResponse.error) {
        console.error(recoverEmailResponse.error);
        return fail(500, {
          email: "An error occured, contact support or try again later.",
        });
      }
    }

    // send verification email to new address
    const verifyEmailToken = await new SignJWT({
      aud: verifyEmailURI,
      sub: user.id,
      exp: now.plus({ minutes: 10 }).toSeconds(),
      email: newEmail,
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(tokenKey);

    const verifyResponse = await resend.emails.send({
      from: verificationEmailAddress,
      to: newEmail,
      subject: "Verify new StreetRelay Email",
      html: changeEmailHTML(user.id, url.origin, verifyEmailToken),
      text: changeEmailText(user.id, url.origin, verifyEmailToken),
    });

    if (verifyResponse.error) {
      return fail(500, { email: "Could not reach address" });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: newEmail,
        emailVerified: false,
        emailVerificationSent: now.toJSDate(),
      },
    });

    return { toast: "A verification email has been sent to your new address." };
  },
  changePassword: async ({ request, cookies }) => {
    const formData = await request.formData();
    const password = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // make sure all fields were sent
    if (!password || !newPassword || !confirmPassword)
      return fail(400, {
        password: !password ? "Please enter your password" : null,
        newPassword: !newPassword ? "Please enter a new password" : null,
        confirmPassword: !confirmPassword
          ? "Please confirm your new password"
          : null,
      });

    const {
      error: authError,
      freshLogin,
      userID,
    } = await authenticateSessionToken(cookies.get("session"));
    if (authError || !freshLogin) fail(400);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userID,
      },
    });

    if (!(await compare(password, user.password)))
      return fail(401, { password: "Incorrect Password" });

    // password gates
    const passwordChecks =
      !!newPassword.match(/[a-z]/) &&
      !!newPassword.match(/[A-Z]/) &&
      !!newPassword.match(/[\W_]/) &&
      !!newPassword.match(/[0-9]/) &&
      newPassword.length >= 8;
    if (!passwordChecks)
      return fail(400, { newPassword: "New password is not strong enough" });

    if (newPassword !== confirmPassword)
      return fail(400, { confirmPassword: "Make sure both passwords match" });

    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        password: await hash(newPassword, 10),
      },
    });

    return { toast: "Password successfully updated" };
  },
  deleteAccount: async ({ cookies }) => {
    const auth = await authenticateSessionToken(cookies.get("session"));
    if (auth.error) return fail(401);

    await prisma.user.delete({
      where: {
        id: auth.userID,
      },
    });

    cookies.delete("session", { path: "/" });
    redirect(301, "/");
  },
};
