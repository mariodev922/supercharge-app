
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


const freezeAuthority =
  !mintInfoData?.error &&
  parsedMint?.type === "mint" &&
  (parsedMint.info?.freezeAuthority === null ||
    typeof parsedMint.info?.freezeAuthority === "string")
    ? parsedMint.info.freezeAuthority
    : "unknown";

  const tokenAccounts = data.result?.value ?? [];

const ownerResponse = await fetch(env.HELIUS_RPC_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 4,
    method: "getMultipleAccounts",
    params: [
      tokenAccounts.map(account => account.address),
      { encoding: "jsonParsed" }
    ]
  }),
  signal: AbortSignal.timeout(8000)
});

const ownerData = ownerResponse.ok
  ? await ownerResponse.json()
  : null;

const accountOwners = ownerData?.result?.value ?? []; 

const ownerCounts = {};

accountOwners.forEach((account) => {
  const owner = account?.data?.parsed?.info?.owner;
  if (owner) {
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
  }
});

const sharedOwners = Object.entries(ownerCounts)
  .filter(([owner, count]) => count > 1)
  .map(([owner, count]) => ({
    owner,
    tokenAccountCount: count
  }));
        
        return Response.json({
          mint,
 sharedOwners,         
mintAuthority: mintAuthority === undefined ? "unknown" : mintAuthority,

 freezeAuthority: freezeAuthority,         
holders: tokenAccounts.map((holder, index) => ({
 
  
...holder,
ownerAddress: accountOwners[index]?.data?.parsed?.info?.owner ?? null,
accountType:
  accountOwners[index]?.data?.parsed?.info?.owner ===
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    ? "exchange"
    : "unclassified",
accountTypeVerified: false,
 accountLabelSource:
  accountOwners[index]?.data?.parsed?.info?.owner ===
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    ? "Solscan (externally labelled)"
   : null,
accountLabel:
  accountOwners[index]?.data?.parsed?.info?.owner ===
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    ? "Binance 3"
    : null
  
})),

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
