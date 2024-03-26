"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { Connect } from "@stacks/connect-react";
import ConnectWallet, { userSession } from "../../components/ConnectWallet";

import { StacksTestnet, StacksDevnet } from "@stacks/network";
import {
  callReadOnlyFunction, standardPrincipalCV

} from '@stacks/transactions';


//acount that deployed the contract


export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [userTokenAmount, setUserTokenAmount] = useState(0)
  const [tokensToMint, setTokensToMint] = useState(0);
  const [tokenReceiver, setTokenReceiver] = useState(null)


  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTokenBalance = async () => {
    const userDevnetAddress = userSession.loadUserData().profile.stxAddress.testnet
    console.log("devNetAddress ", userDevnetAddress)
    try {
      const contractName = 'FanToken';
      const functionName = 'get-balance';
      const network = new StacksDevnet();
      const senderAddress = userDevnetAddress;
      const options = {
        contractAddress: deployer,
        contractName,
        functionName,
        functionArgs: [standardPrincipalCV(userDevnetAddress)],
        network,
        senderAddress,
      };
      const result = await callReadOnlyFunction(options);
      const { value: { value } } = result
      const tokenAmount = +value.toString() / 1_000_000
      setUserTokenAmount(tokenAmount)
      console.log("result => ", tokenAmount + "FT")
    } catch (error) {
      console.log("error => ", error);
    }
  };


  if (!isClient) return null;

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Token Gated Community",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Token Gated Website</h1>
          <nav className={styles.nav}>

            <ConnectWallet />

          </nav>
        </header>
        <main>

       


          <div className={styles.inputContainerColumn}>
            <p>Mint FT Tokens</p> &nbsp;
            <input className={styles.input} value={tokensToMint}
              onChange={(e) => setTokensToMint(e.target.value)}
              type="number" placeholder="00"
            />
            <input className={styles.input}
              type="text"
              placeholder="principal to receive the token"
              value={tokenReceiver}
              onChange={(e) => setTokenReceiver(e.target.value)}

            />
            <button className={styles.button}>Mint FT Tokens</button>
          </div>


          {!isQualified &&
            <div className={styles.container}>
              <h3>Join Community</h3>

              <button className={styles.button}
                >Join Community</button>
            </div>
          }



          {/*Token gated content */}

          {isQualified &&

            <div>
              <h1>Welcome to the community of dog lovers Premium content</h1>
              <h3>This part of the website is token gated!</h3>
              <div className={styles.card}>
                <p>Send a transaction to change the entryTokenAmount variable</p>
                <div className={styles.inputContainer}>
                  <input type="number" className={styles.input} placeholder="00" />
                  <button className={styles.button}>Change Entry Fee</button>
                </div>
              </div>



              <div className={styles.inputContainer}>
                <p>Exit Community and claim back your tokens</p>

                <button className={styles.button}>Exit Community</button>
              </div>

            </div>

          }


        </main>
      </div>
    </Connect>
  );
}
