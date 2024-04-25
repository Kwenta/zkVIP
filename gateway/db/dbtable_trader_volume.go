package db

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/celer-network/goutils/sqldb"
)

// CREATE TABLE IF NOT EXISTS user_trader_volume (
//
//	id TEXT PRIMARY KEY NOT NULL,
//	chain_id INT NOT NULL,
//	account TEXT NOT NULL,
//	trade_year_month INT NOT NULL,
//	volume TEXT NOT NULL,
//	fee TEXT NOT NULL,
//	receipts TEXT NOT NULL,
//	storages TEXT NOT NULL,
//	proof TEXT NOT NULL,
//	brevis_query_hash TEXT NOT NULL,
//	brevis_query_fee NOT NULL,
//	status INT NOT NULL,
//	create_time TIMESTAMPTZ NOT NULL DEFAULT now(),
//	update_time TIMESTAMPTZ NOT NULL DEFAULT now()
//
// );
type UserTradeVolumeFee struct {
	Id              string
	ChainId         uint64
	Account         string
	TradeYearMonth  uint64
	Volume          string
	Fee             string
	Receipts        string
	Storages        string
	Proof           string
	BrevisQueryHash string
	BrevisQueryFee  string
	Status          uint8
	CreateTime      time.Time
	UpdateTime      time.Time
}

const (
	initTraderVolumeAllColumns      = "id,chain_id,account,trader_year_month,volume,fee,receipts,storages,proof,brevis_query_hash,brevis_query_fee,status,create_time,update_time"
	initTraderVolumeAllColumnParams = "$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14"
)

func (d *DAL) InsertUTVF(utvf *UserTradeVolumeFee) (bool, error) {
	q := fmt.Sprintf("INSERT INTO user_trade_volume_fee (%s) VALUES (%s) ON CONFLICT DO NOTHING", initTraderVolumeAllColumns, initTraderVolumeAllColumnParams)
	res, err := d.Exec(q,
		utvf.Id,
		utvf.ChainId,
		utvf.Account,
		utvf.TradeYearMonth,
		utvf.Volume,
		utvf.Fee,
		utvf.Receipts,
		utvf.Storages,
		utvf.Proof,
		utvf.BrevisQueryHash,
		utvf.BrevisQueryFee,
		utvf.Status,
		utvf.CreateTime,
		utvf.UpdateTime)
	return checkSingleInsert(res, err)
}

func (d *DAL) GetUTVFById(id string) (*UserTradeVolumeFee, bool, error) {
	q := fmt.Sprintf("SELECT %s FROM bridge_send WHERE tid = $1", initTraderVolumeAllColumns)
	var row = d.QueryRow(q, id)
	return BuildUTVFFromDbRow(row)
}

func BuildUTVFFromDbRow(row *sql.Row) (*UserTradeVolumeFee, bool, error) {
	var id string
	var chainId uint64
	var account string
	var tradeYearMonth uint64
	var volume string
	var fee string
	var receipts string
	var storages string
	var proof string
	var brevisQueryHash string
	var brevisQueryFee string
	var status uint8
	var createTime time.Time
	var updateTime time.Time

	err := row.Scan(&id, &chainId, &account, &tradeYearMonth, &volume, &fee, &receipts, &storages, &proof,
		&brevisQueryHash, &brevisQueryFee, &status, &createTime, &updateTime)

	found, err := sqldb.ChkQueryRow(err)
	if err != nil {
		return nil, false, err
	}
	if !found {
		return nil, false, nil
	}
	var utvf = new(UserTradeVolumeFee)
	utvf.Id = id
	utvf.ChainId = chainId
	utvf.Account = account
	utvf.TradeYearMonth = tradeYearMonth
	utvf.Volume = volume
	utvf.Fee = fee
	utvf.Receipts = receipts
	utvf.Storages = storages
	utvf.Proof = proof
	utvf.BrevisQueryHash = brevisQueryHash
	utvf.BrevisQueryFee = brevisQueryFee
	utvf.Status = status
	utvf.CreateTime = createTime
	utvf.UpdateTime = updateTime
	return utvf, true, nil
}
