
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the existing SUPERCHARGE website.
  if (url.pathname === "/api/solana-test") {
  try {
    const response = await fetch(
     env.HELIUS_RPC_URL,
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
    if (
  url.pathname !== "/api/health" &&
  url.pathname !== "/api/token-holders"
) {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname === "/api/token-holders") {
      const mint = url.searchParams.get("mint");

      if (!mint || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) {
        return Response.json(
          { error: "Enter a valid Solana token mint address." },
          { status: 400 }
        );
      }

      try {
        const response = await fetch(env.HELIUS_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenLargestAccounts",
            params: [mint]
          }),
          signal: AbortSignal.timeout(8000)
        });

        const data = await response.json();
const supplyResponse = await fetch(env.HELIUS_RPC_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "getTokenSupply",
    params: [mint]
  }),
  signal: AbortSignal.timeout(8000)
});
  const supplyData = await supplyResponse.json();      
        if (!response.ok || data.error) {
          return Response.json(
            { error: "Unable to retrieve token holders." },
            { status: 502 }
          );
        }

     
const mintInfoResponse = await fetch(env.HELIUS_RPC_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 3,
    method: "getAccountInfo",
    params: [mint, { encoding: "jsonParsed" }]
  }),
  signal: AbortSignal.timeout(8000)
});

const mintInfoData = mintInfoResponse.ok
  ? await mintInfoResponse.json()
  : null;

const mintAccount = mintInfoData?.result?.value;
const parsedMint = mintAccount?.data?.parsed;

const mintAuthority =
  !mintInfoData?.error &&
  parsedMint?.type === "mint" &&
  (parsedMint.info?.mintAuthority === null ||
   typeof parsedMint.info?.mintAuthority === "string")
    ? parsedMint.info.mintAuthority
    : undefined;

        return Response.json({
          mint,
          
mintAuthority: mintAuthority === undefined ? "unknown" : mintAuthority,

          holders: data.result?.value ?? [],
          totalSupply: supplyResponse.ok && !supplyData.error
  ? supplyData.result?.value ?? null
  : null
        });
      } catch (error) {
        return Response.json(
          { error: "Token holder lookup failed." },
          { status: 502 }
        );
      }
    }

    // Test that our backend is working.
    return Response.json({
      app: "SUPERCHARGE",
      status: "working",
      message: "Backend connected successfully"
    });
  }
};
