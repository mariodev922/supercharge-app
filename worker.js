
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the existing SUPERCHARGE website.
  if (url.pathname === "/api/solana-test") {
  try {
    const response = await fetch(
      "https://api.mainnet-beta.solana.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getVersion"
        }),
        signal: AbortSignal.timeout(8000)
      }
    );

    const data = await response.json();

    return Response.json({
      connected: response.ok && !!data.result,
      rpcStatus: response.status,
      result: data.result ?? null,
      error: data.error ?? null
    });
  } catch (error) {
    return Response.json({
      connected: false,
      error: String(error)
    }, { status: 502 });
  }
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
