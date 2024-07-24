import * as dotenv from 'dotenv';
import hre, {deployments, ethers} from 'hardhat';
import { FeeReimbursementApp, FeeReimbursementApp__factory } from '../typechain';
import { json } from 'stream/consumers';

dotenv.config();

const init = async () => {
  const [signer] = await ethers.getSigners();
  const app = await deployments.get('FeeReimbursementApp')

  const newApp = FeeReimbursementApp__factory.connect(app.address, signer);

  const migration = FeeReimbursementApp__factory.connect("0x1345c8a6b99536531f1fa3cfe37d8a5b7fc859aa", signer);
  const todoList = new Set<string>()

  for (var i = 0; i < 366; i++){
    const start = 123112576 - 2326 - i * 2326
    const end = 123112576 - i *2326
    console.log(`Query from ${start} to ${end}`)
    var events = await migration.queryFilter(migration.getEvent("FeeRebateAccumulated"),  start, end)

    events.forEach(event => {
      return todoList.add(event.args[0])
    })
  }

  console.log(JSON.stringify(Array.from(todoList)))

  // const tx = await newApp.migrate(Array.from(todoList))
  // console.log(`migrate for ${todoList} tx: ${tx.hash}`)
  // await tx.wait();
};

init();
