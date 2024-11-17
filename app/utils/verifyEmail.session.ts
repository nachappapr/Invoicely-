import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { END_POINTS } from "~/constants";

type VerifySessionData = {
  onboardingEmail: string;
};

type VerifyFlashData = {
  onboardingEmail: string;
};

export const onBoardingSessionKey = "onboardingEmail";

export const verifySesssionStorage = createCookieSessionStorage<
  VerifySessionData,
  VerifyFlashData
>({
  cookie: {
    name: "en_verification",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: process.env.VERIFY_EMAIL_SECRET?.split(","),
  },
});

export const requireVerifiedEmail = async (request: Request) => {
  const verifyEmailSession = await verifySesssionStorage.getSession(
    request.headers.get("Cookie")
  );
  const email = verifyEmailSession.get(onBoardingSessionKey);
  if (!email) {
    throw redirect(END_POINTS.SIGNUP);
  }
  return email;
};
