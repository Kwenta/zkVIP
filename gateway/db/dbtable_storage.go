package db

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/celer-network/goutils/sqldb"
)

type Storage struct {
	Id          string
	Account     string
	Key         string
	BlockNumber uint64
	Status      uint8
	Data        string
	CreateTime  time.Time
	UpdateTime  time.Time
}

const (
	initStorageAllColumns      = "id,account,key,blk_number,status,data,create_time,update_time"
	initStorageAllColumnParams = "$1, $2, $3, $4, $5, $6, $7, $8"
)

func (d *DAL) InsertStorage(storage *Storage) (bool, error) {
	q := fmt.Sprintf("INSERT INTO storage (%s) VALUES (%s) ON CONFLICT DO NOTHING", initStorageAllColumns, initStorageAllColumnParams)
	res, err := d.Exec(q,
		storage.Id,
		storage.Account,
		storage.Key,
		storage.BlockNumber,
		storage.Status,
		storage.Data,
		storage.CreateTime,
		storage.UpdateTime)
	return checkSingleInsert(res, err)
}

func (d *DAL) GetStorageById(id string) (*Storage, bool, error) {
	q := fmt.Sprintf("SELECT %s FROM storage WHERE id = $1", initStorageAllColumns)
	var row = d.QueryRow(q, id)
	return d.BuildStorageFromDbRow(row)
}

func (d *DAL) BuildStorageFromDbRow(row *sql.Row) (*Storage, bool, error) {
	var id string
	var account string
	var key string
	var blockNumber uint64
	var status uint8
	var data string
	var createTime time.Time
	var updateTime time.Time

	err := row.Scan(&id, &account, &key, &blockNumber, &status, &data, &createTime, &updateTime)

	found, err := sqldb.ChkQueryRow(err)
	if err != nil {
		return nil, false, err
	}
	if !found {
		return nil, false, nil
	}
	var storage = new(Storage)
	storage.Id = id
	storage.Account = account
	storage.Key = key
	storage.BlockNumber = blockNumber
	storage.Status = status
	storage.Data = data
	storage.CreateTime = createTime
	storage.UpdateTime = updateTime
	return storage, true, nil
}
