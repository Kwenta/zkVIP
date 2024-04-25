package common

import (
	"encoding/hex"
	"fmt"
	"log"
	"strings"

	ec "github.com/ethereum/go-ethereum/common"
)

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
