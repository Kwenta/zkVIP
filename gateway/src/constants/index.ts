import * as contracts from "../../../markets.json"

const STATUS_UNKNOWN = BigInt(0)
const STATUS_INIT = BigInt(1)
const STATUS_READY = BigInt(2)

const PROOF_STATUS_UNKNOWN = BigInt(0)
const PROOF_STATUS_INIT = BigInt(1)
const PROOF_STATUS_INPUT_READY = BigInt(2)
const PROOF_STATUS_PROVING_SENT = BigInt(3)
const PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED = BigInt(4)
const PROOF_STATUS_PROOF_UPLOAD_SENT = BigInt(5)
const PROOF_STATUS_PROOF_UPLOADED = BigInt(6)
const PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(7)
const PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(8)
const PROOF_STATUS_RETRY = BigInt(9)
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

const PositionModifiedContracts = contracts.contracts

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
    PositionModifiedContracts,
    hexStringToUint8Array,
    isValidPositionModifiedContract
}
