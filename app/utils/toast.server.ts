import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { combineHeaders } from "./misc";

type ToastType = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

type SessionData = {
  toast: ToastType;
};

type SessionFlashData = {
  toast: ToastType;
};

export const toastSessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "in_toast",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: process.env.TOAST_SECRET?.split(","),
  },
});

export async function redirectWithToast(
  url: string,
  toastInput: ToastType,
  init?: ResponseInit
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(
      init?.headers,
      await createToastHeaders(toastInput)
    ),
  });
}

export async function createToastHeaders(toastInput: ToastType) {
  const toastCookieSession = await toastSessionStorage.getSession();
  toastCookieSession.flash("toast", toastInput);
  const cookie = await toastSessionStorage.commitSession(toastCookieSession);
  return new Headers({ "set-cookie": cookie });
}
export async function getToast(request: Request) {
  const toastCookieSession = await toastSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const toast = toastCookieSession.get("toast");

  return {
    toast,
    headers: toast
      ? new Headers({
          "set-cookie": await toastSessionStorage.destroySession(
            toastCookieSession
          ),
        })
      : null,
  };
}
