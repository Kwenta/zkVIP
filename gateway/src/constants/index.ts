const STATUS_UNKNOWN = BigInt(0)
const STATUS_INIT = BigInt(1)
const STATUS_READY = BigInt(2)

const PROOF_STATUS_UNKNOWN = BigInt(0)
const PROOF_STATUS_INIT = BigInt(1)
const PROOF_STATUS_INPUT_REQUEST_SENT = BigInt(2)
const PROOF_STATUS_INPUT_READY = BigInt(3)
const PROOF_STATUS_PROVING_SENT = BigInt(4)
const PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED = BigInt(5)
const PROOF_STATUS_PROOF_UPLOAD_SENT = BigInt(7)
const PROOF_STATUS_PROOF_UPLOADED = BigInt(8)
const PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(9)
const PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(11)
const PROOF_STATUS_INELIGIBLE_ACCOUNT_ID = BigInt(99)

const FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED = 0
const FEE_REIMBURSEMENT_INFO_STATUS_INIT = 1
const FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID = 2
const FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST = 3
const FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT = 4
const FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED = 5

const TX_TYPE_ORDER_FEE_FLOW = 1
const TX_TYPE_EXECUTION = 2

const OrderFlowFeeImposedEvent                = "0x213209073252965f156ceca72c65727bfcf77e3f25ca2a1f23a1b9db58295d48".toLowerCase()
const OrderFlowFeeImposedEventContractAddress = "0x6B32d15a6Cb77ea227A6Fb19532b2de542c45AC6".toLowerCase()
const DelayedOrderSubmittedEvent              = "0x9deb3648ccf8efc44205985ac6ead4ffb30791fea9ce7f9437ae398b31cf9d5a".toLowerCase()
const PositionModifiedEvent                   = "0xc0d933baa356386a245ade48f9a9c59db4612af2b5b9c17de5b451c628760f43".toLowerCase()

const PositionModifiedContracts = [
  "0x2B3bb4c683BFc5239B029131EEf3B1d214478d93",
  "0x2c5e2148bf3409659967fe3684fd999a76171235",
  "0x33d4613639603c845e61a02cd3d2a78be7d513dc",
  "0xeaf0191bca9dd417202cef2b18b7515abff1e196",
  "0x59b007e9ea8f89b069c43f8f45834d30853e3699",
  "0xc203a12f298ce73e44f7d45a4f59a43dbffe204d",
  "0x98ccbc721cc05e28a125943d69039b39be6a21e9",
  "0x3d3f34416f60f77a0a6cc8e32abe45d32a7497cb",
  "0x0ea09d97b4084d859328ec4bf8ebcf9ecca26f1d",
  "0xbbd74c2c8c89d45b822e08fce400f4dde99e600b",
  "0x0940b0a96c5e1ba33aee331a9f950bb2a6f2fb25",
  "0x09f9d7aaa6bef9598c3b676c0e19c9786aa566a8",
  "0x31a1659ca00f617e86dc765b6494afe70a5a9c1a",
  "0x074b8f19fc91d6b2eb51143e1f186ca0ddb88042",
  "0x509072a5ae4a87ac89fc8d64d94adcb44bd4b88e",
  "0x66fc48720f09ac386608fb65ede53bb220d0d5bc",
  "0xd5fbf7136b86021ef9d0be5d798f948dce9c0dea",
  "0x442b69937a0daf9d46439a71567fabe6cb69fbaf",
  "0xb3422e49db926f7c5f5d7daf5f1069abf1b7e894",
  "0xd4e9e0784c3ce4796f54f2ea0d337c7cfccfd645",
  "0x2f0f0865dfdd52adefb583ae824dde7d60b76a3b",
  "0x3f957df3ab99ff502ee09071dd353bf4352bbefe",
  "0x96690aae7cb7c4a9b5be5695e94d72827decc33f",
  "0x5374761526175b59f1e583246e20639909e189ce",
  "0xc8fcd6fb4d15dd7c455373297def375a08942ece",
  "0xc18f85a6dd3bcd0516a1ca08d3b1f0a4e191a2c4",
  "0xc8fcd6fb4d15dd7c455373297def375a08942ece",
  "0x35b0ed8473e7943d31ee1eeead06c8767034ce39",
  "0x6940e7c6125a177b052c662189bb27692e88e9cb",
  "0x96f2842007021a4c5f06bcc72961701d66ff8465",
  "0x296286ae0b5c066cbcfe46cc4ffb375bccafe640",
  "0xd5fccd43205cef11fbaf9b38df15adbe1b186869",
  "0x105f7f2986a2414b4007958b836904100a53d1ad",
  "0xb25529266d9677e9171beaf333a0dea506c5f99a",
  "0xa1ace9ce6862e865937939005b1a6c5ac938a11f",
  "0xdccda0cfbee25b33ff4ccca64467e89512511bf6",
  "0xf7d9bd13f877171f6c7f93f71bdf8e380335dc12",
  "0x91cc4a83d026e5171525afcaed020123a653c2c9",
  "0x6110df298b411a46d6edce72f5caca9ad826c1de",
  "0xaa94c874b91ef16c8b56a1c5b2f34e39366bd484",
  "0x4bf3c1af0faa689e3a808e6ad7a8d89d07bb9ec7",
  "0x5b6beb79e959aac2659bee60fe0d0885468bf886",
  "0x2ea06e73083f1b3314fa090eae4a5f70eb058f2e",
  "0xe698ccc3cd4f2172a848094ea6d28d89d750c16f",
  "0xb7059ed9950f2d9fdc0155fc0d79e63d4441e806",
  "0x4308427c463caeaab50fff98a9dec569c31e4e87",
  "0xae90e9bb73b32505fb56a0f4fd4ec8cf94bab730",
]

function hexStringToUint8Array(hexString: string){
    if (hexString.length % 2 !== 0){
      throw "Invalid hexString";
    }/*from  w w w.  j  av a 2s  . c  o  m*/
    var arrayBuffer = new Uint8Array(hexString.length / 2);
  
    for (var i = 0; i < hexString.length; i += 2) {
      var byteValue = parseInt(hexString.substr(i, 2), 16);
      if (isNaN(byteValue)){
        throw "Invalid hexString";
      }
      arrayBuffer[i/2] = byteValue;
    }
  
    return arrayBuffer;
}

function isValidPositionModifiedContract(contract: string) {
  return PositionModifiedContracts.find(value => {
    return contract.toLowerCase() === value.toLowerCase()
  })
}

export {
    STATUS_UNKNOWN,
    STATUS_INIT,
    STATUS_READY,
    PROOF_STATUS_UNKNOWN,
    PROOF_STATUS_INIT,
    PROOF_STATUS_INPUT_REQUEST_SENT,
    PROOF_STATUS_INPUT_READY,
    PROOF_STATUS_PROVING_SENT,
    PROOF_STATUS_PROOF_UPLOAD_SENT,
    PROOF_STATUS_PROOF_UPLOADED,
    PROOF_STATUS_BREVIS_QUERY_ERROR,
    PROOF_STATUS_ONCHAIN_VERIFIED,
    PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
    PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
    
    FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED,
    FEE_REIMBURSEMENT_INFO_STATUS_INIT,
    FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID,
    FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST,
    FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT,
    FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED,

    TX_TYPE_ORDER_FEE_FLOW,
    TX_TYPE_EXECUTION,

    OrderFlowFeeImposedEvent,
    OrderFlowFeeImposedEventContractAddress,
    DelayedOrderSubmittedEvent,
    PositionModifiedEvent,
    hexStringToUint8Array,
    isValidPositionModifiedContract
}
