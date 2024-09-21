import { redirect } from "@remix-run/node";
import { destroyUserSession } from "~/utils/session.server";

export async function action() {
  const headers = await destroyUserSession();
  return redirect("/auth/signin", {
    headers,
  });
}
