import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js"
import { ethers } from "ethers";

const getAccessToken  = () => {
  return process.env.REACT_APP_API_TOKEN;
}

const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() })
}

const formattedName = (name) => {
  let file_name;

  const trim_name = name.trim() // removes extra whitespaces

  if(trim_name.includes(" ")) {
    file_name = trim_name.replaceAll(" ", "%20")
    
    return file_name
  }
  else return trim_name
}

const makeFileObjects = (file) => {
  const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
  const files = [
    new File([blob], `${file.name}.json`)
  ]
  return files
}

const client = makeStorageClient()

const storeFiles = async (files) => {
  const cid = await client.put(files)
  return cid
}


// mint an NFT
export const createWineNft = async (
  minterContract,
  performActions,
  { name, price, ipfsImage, description }
) => {
  await performActions(async (kit) => {
    if (!name || !description || !ipfsImage || !ipfsImage) return;
    const { defaultAccount } = kit;

    // trim any extra whitespaces from the name and 
    // replace the whitespace between the name with %20
    const file_name = formattedName(name);

    // convert NFT metadata to JSON format
    const data = {
      name,
      price,
      image: ipfsImage,
      description,
      owner: defaultAccount,
    };

    try {
      // save NFT metadata to IPFS
      const files = makeFileObjects(data);
      const file_cid = await storeFiles(files)

      const url = `https://${file_cid}.ipfs.w3s.link/${file_name}.json`
      const _price = ethers.utils.parseUnits(String(price), "ether");

      // upload the NFT, mint the NFT and save the IPFS url to the blockchain
      let transaction = await minterContract.methods
        .addWine(name, ipfsImage, description, url, _price)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

// function to upload an image to Web3.storage
export const uploadToIpfs = async (file) => {
  if (!file) return;
  try {
    const file_name = file[0].name
    const image_name = formattedName(file_name)
    
    const image_cid = await storeFiles(file);
    const image_url = `https://${image_cid}.ipfs.w3s.link/${image_name}`
 
    return image_url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

// fetch all NFTs on the smart contract
export const getWine = async (minterContract) => {
  try {
    const nfts = [];
    const nftsLength = await minterContract.methods.getWineLength().call();

    if(Number(nftsLength) >= 1) {
      for (let i = 0; i < Number(nftsLength); i++) {
        const nft = new Promise(async (resolve) => {
          const wine = await minterContract.methods.getWine(i).call();
          const wineURI = await minterContract.methods.tokenURI(i).call();
          const wineData = await fetchNftMeta(wineURI);        
          const owner = await fetchNftOwner(minterContract, i);
  
          resolve({
            index: i,
            owner,
            name: wineData.name,
            image: wineData.image,
            description: wineData.description,
            wineId: i,
            price: wine[4],
            sold: wine[5]
          });
        });
        nfts.push(nft);
      }
      return Promise.all(nfts);
    }
    else {
      console.log("No vintage wine saved on the smart contract")
    }
    
  } catch (e) {
    console.log({ e });
  }
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const fetch_meta = await fetch(ipfsUrl);
    const meta = await fetch_meta.json()

    return meta;
  } catch (e) {
    console.log({ e });
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

export const buyWine = async (
  minterContract,
  wineId,
  performActions
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      const wine = await minterContract.methods.getWine(wineId).call();
      await minterContract.methods
        .buyWine(wineId)
        .send({ from: defaultAccount, value: wine[4] });
    });
  } catch (error) {
    console.log({ error });
  }
};

export const giftWineNft = async(
  minterContract,
  wineId,
  receiverAddress,
  performActions
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await minterContract.methods
        .giftWine(wineId, receiverAddress)
        .send({ from: defaultAccount });
    });
  } catch (error) {
    console.log({ error });
  }
}
  
export const getOwners = async (minterContract) => {
  try {
    const ownerCount = await minterContract.methods.getOwners().call();
    return ownerCount;
  } catch (error) {
    console.log({ error });
  }
};
