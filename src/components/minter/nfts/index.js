import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getWine,
  buyWine,
  createWineNft,
  giftWineNft,
  fetchNftContractOwner,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({ minterContract, name }) => {
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState(null);

  const getNFTAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getWine(minterContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  // Add new NFT
  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createWineNft(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getNFTAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };
  
  // Buy available NFT
  const buyNft = async (wineId) => {
    try {
      setLoading(true);

      // Create a buy NFT functionality
      await buyWine(minterContract, wineId, performActions);
      getNFTAssets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractOwner = useCallback(async (minterContract) => {
    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  // Gift NFT to a particular user using their wallet address
  const giftNft = async(data) => {
    try {
      setLoading(true)

      const { receiverAdd, wineId } = data;

      await giftWineNft(minterContract, wineId, receiverAdd, performActions);
      getNFTAssets();
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      if (address && minterContract) {
        getNFTAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getNFTAssets, fetchContractOwner]);

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="marketplace">
              <h1
                className="fs-10 fw-bold text-center mb-5"
                style={{color: "#531c1c"}}
              >{name}</h1>
              <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {/* display all NFTs */}
              {nfts.map((_nft) => (
                <Nft
                  key={_nft.index}
                  buyNft={() => buyNft(_nft.wineId)}
                  nft={{
                    ..._nft,
                  }}
                  data={giftNft}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;
