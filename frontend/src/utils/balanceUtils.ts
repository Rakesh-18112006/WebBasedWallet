import { Connection, PublicKey } from "@solana/web3.js";

// Solana balance fetching
const SOLANA_RPC = "https://solana-mainnet.g.alchemy.com/v2/U8ap6YPliy3XzrAq_j-ZP";

export const fetchSolanaBalance = async (address: string): Promise<number> => {
  try {
    const connection = new Connection(SOLANA_RPC);
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    return 0;
  }
};

// Ethereum balance fetching
const ETH_RPC = "https://eth-mainnet.g.alchemy.com/v2/U8ap6YPliy3XzrAq_j-ZP";

export const fetchEthereumBalance = async (
  address: string
): Promise<number> => {
  try {
    const response = await fetch(ETH_RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.result) {
      // Convert hex to decimal and then to ETH (1 ETH = 1e18 wei)
      const balanceWei = BigInt(data.result);
      return Number(balanceWei) / 1e18;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    return 0;
  }
};
