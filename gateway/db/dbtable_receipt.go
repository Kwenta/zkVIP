package db

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/celer-network/goutils/sqldb"
	"github.com/ethereum/go-ethereum/common"
)

type Receipt struct {
	TxHash     common.Hash
	Status     uint8
	Data       string
	CreateTime time.Time
	UpdateTime time.Time
}

const (
	initReceiptAllColumns      = "tx_hash,status,data,create_time,update_time"
	initReceiptAllColumnParams = "$1, $2, $3, $4, $5,"
)

func (d *DAL) InsertReceipt(receipt *Receipt) (bool, error) {
	q := fmt.Sprintf("INSERT INTO receipt (%s) VALUES (%s) ON CONFLICT DO NOTHING", initReceiptAllColumns, initReceiptAllColumnParams)
	res, err := d.Exec(q,
		receipt.TxHash.String(),
		receipt.Status,
		receipt.Data,
		receipt.CreateTime,
		receipt.UpdateTime)
	return checkSingleInsert(res, err)
}

func (d *DAL) GetReceiptByTxHash(txHash string) (*Receipt, bool, error) {
	q := fmt.Sprintf("SELECT %s FROM receipt WHERE tx_hash = $1", initReceiptAllColumns)
	var row = d.QueryRow(q, txHash)
	return d.BuildReceiptFromDbRow(row)
}

func (d *DAL) BuildReceiptFromDbRow(row *sql.Row) (*Receipt, bool, error) {
	var txHash string
	var status uint8
	var data string
	var createTime time.Time
	var updateTime time.Time

	err := row.Scan(&txHash, &status, &data, &createTime, &updateTime)

	found, err := sqldb.ChkQueryRow(err)
	if err != nil {
		return nil, false, err
	}
	if !found {
		return nil, false, nil
	}
	var receipt = new(Receipt)
	receipt.TxHash = common.HexToHash(txHash)
	receipt.Status = status
	receipt.Data = data
	receipt.CreateTime = createTime
	receipt.UpdateTime = updateTime
	return receipt, true, nil
}
