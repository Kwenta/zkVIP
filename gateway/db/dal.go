package db

import (
	"database/sql"
	"strings"

	"github.com/celer-network/goutils/log"
	"github.com/celer-network/goutils/sqldb"
)

type DAL struct {
	*sqldb.Db
	mid uint64
}

func NewDAL(driver, info string, poolSize int, mid uint64) (*DAL, error) {
	db, err := sqldb.NewDb(driver, info, poolSize)
	if err != nil {
		log.Errorf("fail with db init:%s, %s, %d, err:%+v", driver, info, poolSize, err)
		return nil, err
	}

	dal := &DAL{
		db,
		mid,
	}
	return dal, nil
}

func (d *DAL) Close() {
	if d.Db != nil {
		d.Db.Close()
		d.Db = nil
	}
}

func closeRows(rows *sql.Rows) {
	if err := rows.Close(); err != nil {
		log.Warnln("closeRows: error:", err)
	}
}

func (d *DAL) DB() *sqldb.Db {
	return d.Db
}

// Is this DB error an indication of a duplicate on a unique column?
// Note: for now this works on CockroachDB and Postgres.
func isDupErr(err error) bool {
	errMsg := strings.ToLower(err.Error())
	return strings.Contains(errMsg, "violates unique constraint")
}

func checkSingleInsert(res sql.Result, dbErr error) (bool, error) {
	if dbErr != nil {
		return false, dbErr
	}
	got, rowErr := res.RowsAffected()
	if rowErr != nil {
		return false, rowErr
	}
	return got == 0, nil
}
