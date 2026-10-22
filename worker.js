
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the existing SUPERCHARGE website.
    if (url.pathname === "/api/solana-test") {
  return Response.json({
    connected: false,
    message: "SUPERCHARGE test endpoint is working"
  });
}
    if (url.pathname !== "/api/health") {
      return env.ASSETS.fetch(request);
    }

    // Test that our backend is working.
    return Response.json({
      app: "SUPERCHARGE",
      status: "working",
      message: "Backend connected successfully"
    });
  }
};
