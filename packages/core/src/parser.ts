import { MediaSetFragment } from "@lens-protocol/client";

export const parseUri = (uri: string) => {
  if (uri.startsWith("ipfs")) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  if (uri.startsWith("https://")) {
    return uri;
  }
  if (uri.startsWith("ar://")) {
    return `https://arweave.net/${uri.slice(5)}`;
  }
  console.log(`Invalid URI ${uri}`);
  return "";
};

export const numberToHex = (num: number) => {
  let hexValue = num.toString(16);

  // Ensure an even number of digits
  if (hexValue.length % 2 !== 0) {
    hexValue = "0" + hexValue;
  }

  return `0x${hexValue}`;
};

export const hexToNumber = (hex: string) => parseInt(hex, 16).toString();

export const capitalize = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getMediaUrl = (media: MediaSetFragment) => {
  const item = media as any;
  try {
    return parseUri(item.item);
  } catch {
    return parseUri(media.original.url);
  }
};

export const parseHandle = (input: string): string => {
  if (!input.endsWith(".lens") && input != "lensprotocol") {
    return input + ".lens";
  }
  return input;
};