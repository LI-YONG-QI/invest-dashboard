"use client";
import { LOCAL_DOMAIN } from "@/utils/constants";
import {
  ConnectKitProvider,
  SIWEConfig,
  SIWEProvider,
  getDefaultConfig,
} from "connectkit";
import { SiweMessage } from "siwe";
import { goerli } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const siweConfig: SIWEConfig = {
    getNonce: async () => {
      const res = await fetch(`${LOCAL_DOMAIN}/siwe/nonce`, {
        credentials: "include",
      });

      const nonce = await res.text();
      return nonce;
    },

    createMessage: ({ nonce, address, chainId }) => {
      const msg = new SiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
        statement: "Sign in With Ethereum.",
      }).prepareMessage();

      return msg;
    },

    verifyMessage: async ({ message, signature }) => {
      const res = await fetch(`${LOCAL_DOMAIN}/siwe/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Need to send cookies
        body: JSON.stringify({ message, signature }),
      });

      return res.ok;
    },

    getSession: async () => {
      const res = await fetch(`${LOCAL_DOMAIN}/siwe/session`, {
        method: "GET",
        credentials: "include",
      });

      return res.ok ? res.json() : null;
    },

    signOut: async () => {
      const res = await fetch(`${LOCAL_DOMAIN}/siwe/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.status === 200;
    },
  };

  const config = createConfig(
    getDefaultConfig({
      chains: [goerli],
      alchemyId: "JbPqq2dooxKsnMdfKCLteEBhF8pEIQiD",
      walletConnectProjectId: "7dce74abb0b217e1fe901b896125596f",
      appName: "Investment Portfolio",
    })
  );

  return (
    <WagmiConfig config={config}>
      <SIWEProvider {...siweConfig}>
        <ConnectKitProvider>
          <div>{children}</div>
        </ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  );
};

export default Provider;
