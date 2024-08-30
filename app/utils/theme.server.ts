import * as cookie from "cookie";
import { type Theme } from "~/global";

const cookieName = "theme";

export const getTheme = (req: Request): Theme => {
  const cookies = req.headers.get("Cookie");
  const parsedCookies = cookies ? cookie.parse(cookies)?.theme : "light";

  if (parsedCookies === "dark" || parsedCookies === "light")
    return parsedCookies;

  return "light";
};

export function setTheme(theme: Theme): string {
  return cookie.serialize(cookieName, theme, {
    path: "/",
    httpOnly: true,
  });
}
