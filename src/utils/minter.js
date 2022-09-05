import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js"
import { ethers } from "ethers";

const getAccessToken  = () => {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyZDE2OWM0Y0VhMDREQTNGMjQ4RDg5MDUwNjkxNzk2NWJkZjUxN2MiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI0MTU5OTM5NjQsIm5hbWUiOiJ3aW5lcnkifQ.dV9Ojvo_yX4QS9lYKcng-B1Vfu1vwmKIXyad_xcTNH8"
}

const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() })
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
const fileUrl = async (files) => {
  for (const file of files) {
    const file_url = `https://${file.cid}.ipfs.w3s.link/` // get file url
    return file_url
  }
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
      // console.log(files)

      const file_cid = await storeFiles(files)
      // console.log(file_cid)

      // IPFS url for uploaded metadata
      // let file_url;
      const cid = await client.get(file_cid);
      const cid_file = await cid.files();
      const url = await fileUrl(cid_file);
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
    console.log(`getting cid...`)

    const image_cid = await storeFiles(file);
    console.log(`Image cid: ${image_cid}`)
    

    const image_f = await client.get(image_cid);
    console.log(`Image file: ${image_f}`)

    console.log(`https://${image_cid}.ipfs.w3s.link/`)
  
    const img = await image_f.files();
    console.log(img)

    for (const file of img) {
      console.log(file)

      const image_url = `https://${file.cid}.ipfs.w3s.link/`;
      console.log(`Image url: ${image_url}`)

      return image_url;
    }
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

// get the address that deployed the NFT contract
export const fetchNftContractOwner = async (minterContract) => {
  try {
    let owner = await minterContract.methods.owner().call();
    return owner;
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
