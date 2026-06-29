import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

export class FreighterError extends Error {}

// True if the Freighter extension is installed and reachable.
export async function hasFreighter(): Promise<boolean> {
  try {
    const res = await isConnected();
    return Boolean(res.isConnected) && !res.error;
  } catch {
    return false;
  }
}

// Prompts the user to connect (or returns the already-granted address).
export async function connectWallet(): Promise<string> {
  if (!(await hasFreighter())) {
    throw new FreighterError(
      "Freighter wallet not detected. Install it at freighter.app, then reload.",
    );
  }
  const granted = await requestAccess();
  if (granted.error) {
    throw new FreighterError(granted.error.message ?? "Wallet access denied");
  }
  if (granted.address) return granted.address;

  const current = await getAddress();
  if (current.error || !current.address) {
    throw new FreighterError("Could not read wallet address");
  }
  return current.address;
}

// Signs a prepared transaction XDR and returns the signed XDR.
export async function signXdr(
  xdr: string,
  networkPassphrase: string,
): Promise<string> {
  const res = await signTransaction(xdr, { networkPassphrase });
  if (res.error) {
    throw new FreighterError(res.error.message ?? "Signing was rejected");
  }
  return res.signedTxXdr;
}
