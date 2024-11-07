import { Resend } from "resend";
import { RESEND_KEY } from "$env/static/private";

export const resend = new Resend(RESEND_KEY);

export const notificationsEmailAddress =
  "StreetRelay <notifications@mail.streetrelay.me>";
export const recoveryEmailAddress =
  "StreetRelay <recovery@mail.streetrelay.me>";
export const verificationEmailAddress =
  "StreetRelay <verify@mail.streetrelay.me>";

export const getStartedEmailHTML = (
  origin: string,
  verificationToken: string
) => `Welcome to StreetRelay! We're so glad you've decided to join!<br>
To verify your email and opt-in to email notifications, click the link below:<br><br>

<a href="${origin}/verify-email?t=${verificationToken}">Verify Email</a><br><br>

If you did not request this email, you can ignore it.<br>
This link will expire in 10 minutes.`;

export const getStartedEmailText = (
  origin: string,
  verificationToken: string
) => `Welcome to StreetRelay! We're so glad you've decided to join!
To verify your email and opt-in to email notifications, click the link below:

${origin}/verify-email?t=${verificationToken}

If you did not request this email, you can ignore it.
This link will expire in 10 minutes.`;

export const resetPasswordEmailHTML = (
  origin: string,
  token: string
) => `You have requested a password reset for your StreetRelay account.<br>
Click the link below to reset your password and recover your account:<br><br>

<a href="${origin}/reset-password?t=${token}">Reset Password</a><br><br>

If you did not request this email, you can ignore it.<br>
This link will expire in 5 minutes.`;
export const resetPasswordEmailText = (
  origin: string,
  token: string
) => `You have requested a password reset for your StreetRelay account.
Click the link below to reset your password and recover your account:

${origin}/reset-password?t=${token}

If you did not request this email, you can ignore it.
This link will expire in 5 minutes.`;

export const verifyEmailHTML = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}<br/>
You have requested an email verification link on StreetRelay<br/>
Click the link below to verify your email address.<br/><br/>

<a href="${origin}/verify-email?t=${token}">Verify Email</a><br/><br/>

If you did not request this email, you can ignore it.<br/>
This link will expire in 10 minutes.`;
export const verifyEmailText = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}
You have requested an email verification link on StreetRelay
Click the link below to verify your email address.

${origin}/verify-email?t=${token}

If you did not request this email, you can ignore it.
This link will expire in 10 minutes.`;

export const recoverEmailText = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}
Your email has recently been changed on StreetRelay.
If you did not request this change, click the link below to recover your account.

${origin}/verify-email?t=${token}

If you requested this change, you can ignore this email.
This link will expire in 30 days`;
export const recoverEmailHTML = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}<br/>
Your email has recently been changed on StreetRelay.<br/>
If you did not request this change, click the link below to recover your account.<br/><br/>

<a href="${origin}/verify-email?t=${token}">Recover Account</a><br/><br/>

If you requested this change, you can ignore this email.<br/>
This link will expire in 30 days.`;

export const changeEmailText = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}
You have requested to change your StreetRelay email address
Please verify this email change by clicking the link below.

${origin}/verify-email?t=${token}

If you did not request this email, you can ignore it.
This link will expire in 10 minutes.`;
export const changeEmailHTML = (
  username: string,
  origin: string,
  token: string
) => `Hi, ${username}<br/>
You have requested to change your StreetRelay email address<br/>
Please verify this email change by clicking the link below.<br/><br/>

<a href="${origin}/verify-email?t=${token}">Verify Email</a><br/><br/>

If you did not request this email, you can ignore it.<br/>
This link will expire in 10 minutes.`;
