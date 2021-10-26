const serverUrl = 'https://ysfwsudhbf9r.usemoralis.com:2053/server';
const appId = "EbhJouPTp4Hj6edmmNkBxYBbceoh1WC6XWzyZBtJ";

Moralis.start({ serverUrl, appId });

const web3 = new Web3("https://speedy-nodes-nyc.moralis.io/ecb9b1fb67d679e74a8cf95c/eth/mainnet");

const ipfsBase = 'https://ipfs.moralis.io:2053/ipfs';
const decimal = 18;

async function getTransactionVal(txn) {
  return web3.eth.getTransaction(txn).then( v => {
    return parseInt(v.value)/(10**decimal)
  });
}

async function getImage(tokenId) {
  const imageURL = await axios.get(`${ipfsBase}/QmRdNB3Q6Q5gVWnduBmxNZb4p9zKFmM3Qx3tohBb8B2KRK/${tokenId}`).then( r => {
    return `${ipfsBase}/${r.data.image.split('ipfs://')[1]}`;
  });
  document.getElementById("frog").src = imageURL;
}

async function main() {
  const FlyFrogs = Moralis.Object.extend("FlyFrogs");
  const query = new Moralis.Query(FlyFrogs);
  query.limit(1);
  query.descending("block_timestamp");
  const results = await query.find();
  const tokenId = results[0].get('tokenId');
  await getImage(tokenId);
  const txnHash = results[0].get('transaction_hash');
  document.getElementById("val").textContent = await getTransactionVal(txnHash);
  document.getElementById("os").href = `https://opensea.io/assets/0x31d4da52c12542ac3d6aadba5ed26a3a563a86dc/${tokenId}`;
  document.getElementById("etherscan").href = `https://etherscan.com/tx/${txnHash}`;
}

main()