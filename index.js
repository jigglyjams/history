import { MongoClient } from 'mongodb'
import dayjs from 'dayjs';

var col;

async function connectDB() {
  const client = new MongoClient("mongodb://143.198.132.54:56728/");
  await client.connect();
  col = client.db('parse').collection('FlyFrogs');
}

async function getTokenHistory(id) {
  const results = await col.find({'tokenId': id}).project(
    {'_id': 0, _created_at: 0, _updated_at: 0, log_index:0}
    ).sort({
      'block_timestamp' : -1}).toArray();
  return(results);
}

function getHolderTimes(history) {
  if (history.length > 0){
    var wallet_time = [];
    for (let i = 1; i < history.length; i++) {
      const timedelta = dayjs(history[i-1].block_timestamp.iso) - dayjs(history[i].block_timestamp.iso);
      wallet_time.push([history[i-1].to, timedelta]);
    }
    wallet_time.push([history[history.length-1].to,dayjs() - history[history.length-1].block_timestamp.iso]);
    console.log(wallet_time);
  }
}

await connectDB();
for (let x = 1; x < 10000; x++){
  console.log(x);
  getHolderTimes(await getTokenHistory(x.toString()));
}
client.close();