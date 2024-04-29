const STATUS_UNKNOWN = BigInt(0)
const STATUS_INIT = BigInt(1)
const STATUS_READY = BigInt(2)

const PROOF_STATUS_UNKNOWN = BigInt(0)
const PROOF_STATUS_INIT = BigInt(1)
const PROOF_STATUS_INPUT_REQUEST_SENT = BigInt(2)
const PROOF_STATUS_INPUT_READY = BigInt(3)
const PROOF_STATUS_PROVING_SENT = BigInt(4)
const PROOF_STATUS_PROVING_FINISHED = BigInt(5)
const PROOF_STATUS_PROOF_UPLOADED = BigInt(6)
const PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(7)
const PROOF_STATUS_BREVIS_REQUEST_SUBMITTED = BigInt(8)
const PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(9)
const PROOF_STATUS_INELIGIBLE_ACCOUNT_ID = BigInt(99)

const FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED = 0
const FEE_REIMBURSEMENT_INFO_STATUS_INIT = 1
const FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID = 2
const FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST = 3
const FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT = 4
const FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED = 5

const PoolAddr = "0x9616bdc926880053545675561afba23ad0455e47" // 

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

export {
    STATUS_UNKNOWN,
    STATUS_INIT,
    STATUS_READY,
    PROOF_STATUS_UNKNOWN,
    PROOF_STATUS_INIT,
    PROOF_STATUS_INPUT_REQUEST_SENT,
    PROOF_STATUS_INPUT_READY,
    PROOF_STATUS_PROVING_SENT,
    PROOF_STATUS_PROVING_FINISHED,
    PROOF_STATUS_PROOF_UPLOADED,
    PROOF_STATUS_BREVIS_QUERY_ERROR,
    PROOF_STATUS_BREVIS_REQUEST_SUBMITTED,
    PROOF_STATUS_ONCHAIN_VERIFIED,
    PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
    
    FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED,
    FEE_REIMBURSEMENT_INFO_STATUS_INIT,
    FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID,
    FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST,
    FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT,
    FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED,
    PoolAddr,
    hexStringToUint8Array
}
