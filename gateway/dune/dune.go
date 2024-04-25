package query

import (
	"fmt"
	"math/big"

	"github.com/celer-network/goutils/log"
	"github.com/duneanalytics/duneapi-client-go/config"
	"github.com/duneanalytics/duneapi-client-go/dune"
	"github.com/ethereum/go-ethereum/common"
)

var (
	EmptyHash  = common.Hash{}
	MAX_INT, _ = new(big.Int).SetString("0x10000000000000000000000000000000000000000000000000000000000000000", 0)
)

func Query(apiKey string, queryId int, queryParameters map[string]any) ([]map[string]any, error) {
	env := config.FromAPIKey(apiKey)
	client := dune.NewDuneClient(env)
	return client.RunQueryGetRows(queryId, queryParameters)
}

func QueryTransactions(apiKey string, startBlkNumber, endBlkNumber uint64) (txHash []common.Hash, err error) {
	result := []common.Hash{}
	duneResult, err := Query(apiKey, 3404463, map[string]any{
		"from_blk": startBlkNumber,
		"to_blk":   endBlkNumber,
	})
	if err != nil {
		log.Errorf("failed to Query total fee transactions from %d to %d, err %s", startBlkNumber, endBlkNumber, err)
		return []common.Hash{}, err
	}
	// hashHashesStr := ""
	hashHashes := []common.Hash{}

	for _, value := range duneResult {
		hash, valid := value["tx_hash"]

		if !valid {
			return result, fmt.Errorf("invalid tx_hash")
		}
		hashHashes = append(hashHashes, common.HexToHash(hash.(string)))
	}

	return hashHashes, nil
}
