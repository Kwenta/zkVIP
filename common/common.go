package common

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/consensys/gnark-crypto/ecc/bls12-377/fr/mimc"
	ec "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type Contracts struct {
	Contracts []string `json:"contracts"`
}

func CheckErr(err error, msg string) {
	if err != nil {
		log.Fatalln("error ("+msg+"):", err)
	}
}

// Empty string will be excluded in this slice
func SplitByComma(input string) []string {
	splitFn := func(c rune) bool {
		return c == ','
	}
	return strings.FieldsFunc(input, splitFn)
}

// Hex2Addr accepts hex string with or without 0x prefix and return Addr
func Hex2Addr(s string) ec.Address {
	return ec.BytesToAddress(Hex2Bytes(s))
}

func Hex2Bytes(s string) (b []byte) {
	if len(s) >= 2 && s[0] == '0' && (s[1] == 'x' || s[1] == 'X') {
		s = s[2:]
	}
	// hex.DecodeString expects an even-length string
	if len(s)%2 == 1 {
		s = "0" + s
	}
	b, _ = hex.DecodeString(s)
	return b
}

func Hex2Hash(s string) ec.Hash {
	return ec.BytesToHash(Hex2Bytes(s))
}

func Bytes2Hash(b []byte) ec.Hash {
	return ec.BytesToHash(b)
}

func ConvertBooleanArrayToString(boolVars []bool) string {
	values := make([]string, len(boolVars))

	for i, boolVar := range boolVars {
		value := 0

		if boolVar {
			value = 1
		}

		values[i] = fmt.Sprintf("%d", value)
	}

	return strings.Join(values, ",")
}

func check(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func CalculateHash(data [][]byte) ([]byte, error) {
	h := mimc.NewMiMC()
	for _, value := range data {
		h.Write(miMCBlockPad0(value, h.BlockSize()))
	}
	return h.Sum(nil), nil
}

// MiMCBlockPad0 pad 0 into miMC block up to specific block size in Big-Endian
func miMCBlockPad0(data []byte, blockSize int) []byte {
	var block = make([]byte, blockSize)
	for i := 0; i < blockSize; i++ {
		if i < blockSize-len(data) {
			block[i] = 0
		} else {
			block[i] = data[len(data)-blockSize+i]
		}
	}
	return block
}

func CalculateContractsHash() ([512]sdk.Uint248, []byte, error) {
	var contractsBytes [512][]byte
	var contractsInUint248 [512]sdk.Uint248
	jsonFile, err := os.Open("../markets.json")
	if err != nil {
		return contractsInUint248, nil, err
	}

	data, err := io.ReadAll(jsonFile)
	if err != nil {
		return contractsInUint248, nil, err
	}

	contracts := Contracts{}
	err = json.Unmarshal(data, &contracts)
	if err != nil {
		return contractsInUint248, nil, err
	}

	for i := 0; i < len(contractsBytes); i++ {
		if i < len(contracts.Contracts) {
			b, err := hexutil.Decode(contracts.Contracts[i])
			if err != nil {
				return contractsInUint248, nil, err
			}
			contractsBytes[i] = b
			contractsInUint248[i] = sdk.ConstUint248(b)
		} else {
			contractsBytes[i] = []byte{0}
			contractsInUint248[i] = sdk.ConstUint248([]byte{0})
		}
	}

	contractHash, err := CalculateHash(contractsBytes[:])
	if err != nil {
		return contractsInUint248, nil, err
	}
	fmt.Printf("contracts hash: 0x%x\n", contractHash)
	return contractsInUint248, contractHash, nil
}
