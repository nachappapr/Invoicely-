import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { combineHeaders } from "./misc";

type SessionData = {
  sessionId: string;
};

type SessionFlashData = {
  sessionId: string;
};

export const sessionKey = "sessionId";

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "in_session",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: process.env.SESSION_SECRET?.split(","),
  },
});

export async function createUserSession(userInput: string) {
  const userSession = await sessionStorage.getSession();
  userSession.set(sessionKey, userInput);
  const cookie = await sessionStorage.commitSession(userSession);
  return new Headers({ "set-cookie": cookie });
}

export async function getUserSession(request: Request) {
  const userSession = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const sessionId = userSession.get(sessionKey);
  return {
    sessionId,
    userSession,
    headers: sessionId
      ? new Headers({
          "set-cookie": await sessionStorage.commitSession(userSession),
        })
      : null,
  };
}

export async function redirectWithUserSession(
  url: string,
  userInput: string,
  init?: ResponseInit
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createUserSession(userInput)),
  });
}

export async function destroyUserSession() {
  const userSession = await sessionStorage.getSession();
  return new Headers({
    "set-cookie": await sessionStorage.destroySession(userSession),
  });
}
