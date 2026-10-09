// www.rith.dev → rith.dev with the same path, so every page has one address.
// Deployed by hand (it never changes): pnpm exec wrangler deploy -c workers/www-redirect/wrangler.jsonc
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = "rith.dev";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  },
};
