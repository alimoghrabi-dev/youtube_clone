export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile", "/feed/subscriptions", "/feed/playlists", "/feed"],
};
