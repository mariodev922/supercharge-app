
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
  url.pathname !== "/api/token-holders" &&
  url.pathname !== "/api/wallet-activity"
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
const totalSupplyRaw =
  parsedMint?.info?.supply ?? null;
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
const ownerLookupSuccessful = ownerResponse.ok && Array.isArray(ownerData?.result?.value);
const ownerCounts = {};

const ownerBalances = {};

accountOwners.forEach((account, index) => {
  const owner = account?.data?.parsed?.info?.owner;
  if (owner) {
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;

const balance =
  Number(tokenAccounts[index]?.amount ?? 0);
if (Number.isFinite(balance)) {
  ownerBalances[owner] = (ownerBalances[owner] || 0) + balance;
}
 
  }
});

const sharedOwners = Object.entries(ownerCounts)
  .filter(([owner, count]) => count > 1)
  .map(([owner, count]) => ({
    owner,
    
tokenAccountCount: count,
combinedBalance: ownerBalances[owner] || 0,
supplyPercentage:
  totalSupplyRaw !== null && Number(totalSupplyRaw) > 0
    ? ((ownerBalances[owner] || 0) /
        Number(totalSupplyRaw)) * 100
    : null

  }));
        
        return Response.json({
          mint,
 sharedOwners,  
 ownerLookupSuccessful,         
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


if (url.pathname === "/api/wallet-activity") {
  const wallet = url.searchParams.get("wallet");

  if (!wallet || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
    return Response.json(
      { ok: false, error: "Enter a valid Solana wallet address." },
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
        method: "getSignaturesForAddress",
        params: [wallet, { limit: 5 }]
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      throw new Error("Helius request failed");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error("Solana RPC error");
    }
 const firstSignature = data.result?.[0]?.signature;

let transactionDetails = null;

if (firstSignature) {
  const detailResponse = await fetch(env.HELIUS_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "getTransaction",
      params: [
        firstSignature,
        {
          encoding: "jsonParsed",
          maxSupportedTransactionVersion: 1
        }
      ]
    }),
    signal: AbortSignal.timeout(15000)
  });

  if (!detailResponse.ok) {
  const errorText = await detailResponse.text();
  throw new Error(
    `Helius HTTP ${detailResponse.status}: ${errorText.slice(0, 200)}`
  );
}
  const detailData = await detailResponse.json();

  if (detailData.error) {
  console.error("Helius transaction RPC error:", JSON.stringify(detailData.error));  
  console.error("Transaction detail RPC error:", detailData.error);
  transactionDetails = null;
} else {
  transactionDetails = detailData.result ?? null;
}
}  

let walletActivityAlert = null;
let walletSOLChange = null;
if (transactionDetails?.meta?.preBalances &&
    transactionDetails?.meta?.postBalances) {
  const keys = transactionDetails.transaction?.message?.accountKeys ?? [];
  const walletIndex = keys.findIndex(
    key => (typeof key === "string" ? key : key.pubkey) === wallet
  );

  if (walletIndex !== -1) {
    const before = transactionDetails.meta.preBalances[walletIndex];
    const after = transactionDetails.meta.postBalances[walletIndex];

    if (Number.isFinite(before) && Number.isFinite(after)) {
      const decreaseSOL = (before - after) / 1e9;

      if (decreaseSOL >= 100) {
        walletActivityAlert = {
          type: "large_sol_balance_decrease",
          amountSOL: Number(decreaseSOL.toFixed(4)),
          message: "Large SOL balance decrease detected in the latest transaction. This does not necessarily indicate a transfer, sale or suspicious activity."
        };
      }
    }
  }
}

const transactions = (data.result ?? []).map(tx => ({
  signature: tx.signature,
  timestamp: tx.blockTime ?? null,
  status: tx.err ? "Failed" : "Success",
  solscan: `https://solscan.io/tx/${tx.signature}`
}));
    
return Response.json({
  ok: true,
  wallet,
  transactions,
  transactionDetails,
  walletActivityAlert
});

  } catch (error) {
    console.error("Wallet activity error:", error);
    return Response.json(
      { ok: false, error: "Wallet activity lookup failed." },
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
