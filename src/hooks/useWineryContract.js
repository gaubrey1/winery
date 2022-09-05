import {useContract} from './useContract';
import wineryAbi from '../contracts/Winery.json';
import wineryContractAddress from '../contracts/Winery-address.json';


// export interface for NFT contract
export const useWineryContract = () => useContract(wineryAbi.abi, wineryContractAddress.Winery);
