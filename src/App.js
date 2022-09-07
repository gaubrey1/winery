import React from "react";
import Cover from "./components/minter/Cover";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/wallet";
import { useBalance, useWineryContract } from "./hooks";
import Nfts from "./components/minter/nfts";
import { useContractKit } from "@celo-tools/use-contractkit";
import "./App.css";
import { Container, Nav } from "react-bootstrap";
import logo from "./assets/logo.png"

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();

  //  fetch user's celo balance using hook
  const { balance, getBalance } = useBalance();

  // initialize the NFT mint contract
  const wineryContract = useWineryContract();

  return (
    <>
      <Notification />
      <Nav className="nav justify-content-between px-5 py-3">
        <Nav.Item>
          <img className="logo_img" src={logo} alt="Logo"/>
          <span className="logo_name">Winery</span>
        </Nav.Item>
        {address ? (
          <Nav.Item>
            {/*display user wallet*/}
            <Wallet
              address={address}
              amount={balance.CELO}
              symbol="CELO"
              destroy={destroy}
            />
          </Nav.Item>
          ) : (
          <Nav.Item>
            <button
              onClick={() => connect().catch((e) => console.log(e))}
            >Get started</button>
          </Nav.Item>
        )}
      </Nav>
      {address ? (
        <Container fluid="md">
          <main>
            <Nfts
              name="Winery Marketplace"
              updateBalance={getBalance}
              minterContract={wineryContract}
            />
          </main>
        </Container>
      ) : (
        <Cover connect={connect} />
      )}
    </>
  );
};

export default App;
