"use client";

import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import styles from "../app/page.module.css";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

const trimAddress = (address) => {
  if (address) {
    const start = address.substr(0, 6);
    const middle = ".....";
    const end = address.substr(address.length - 6, address.length)
    return `${start}${middle}${end}`
  }
  return null;
}

function authenticate() {
  showConnect({
    appDetails: {
      name: "Token Gated Demo",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div className="Container">
        <button className={styles.buttonConnected} onClick={disconnect}>
          Disconnect Wallet {trimAddress(userSession.loadUserData().profile.stxAddress.testnet)}
        </button>
      </div>
    );
  }

  return (
    <button className={styles.button} onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
