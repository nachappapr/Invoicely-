import { createCookieSessionStorage } from "@remix-run/node";

export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "in_toast",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: process.env.TOAST_SECRET?.split(","),
  },
});
