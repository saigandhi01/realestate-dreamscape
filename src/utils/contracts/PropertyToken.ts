
import { ethers } from "ethers";

// This is a simplified ABI for an ERC-721 Property Token
export const PROPERTY_TOKEN_ABI = [
  // ERC-721 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  
  // Property-specific functions
  "function propertyDetails(uint256 tokenId) view returns (string name, string location, uint256 price, uint256 area)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mintToken(address to, uint256 tokenId, string name, string location, uint256 price, uint256 area)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];

export const getPropertyTokenContract = (
  address: string, 
  provider: ethers.providers.Web3Provider
) => {
  return new ethers.Contract(address, PROPERTY_TOKEN_ABI, provider);
};

export interface PropertyTokenDetails {
  name: string;
  location: string;
  price: ethers.BigNumber;
  area: ethers.BigNumber;
}

export const getPropertyDetails = async (
  contractAddress: string,
  tokenId: number,
  provider: ethers.providers.Web3Provider
): Promise<PropertyTokenDetails> => {
  const contract = getPropertyTokenContract(contractAddress, provider);
  const details = await contract.propertyDetails(tokenId);
  return {
    name: details.name,
    location: details.location,
    price: details.price,
    area: details.area
  };
};
