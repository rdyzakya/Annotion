package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DBSetupMain() {

	dbUsn := ""
	dbPass := ""
	dbHost := ""
	dbPort := ""
	dbName := ""

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUsn, dbPass, dbHost, dbPort, dbName)

	dbase, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})

	if err != nil {
		panic("Failed connect to database -> " + err.Error())
	}
	DB = dbase
}

func DBSetupTest() {
	dbUsn := ""
	dbPass := ""
	dbHost := ""
	dbPort := ""
	dbName := ""

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUsn, dbPass, dbHost, dbPort, dbName)

	dbase, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})

	if err != nil {
		panic("Failed connect to database -> " + err.Error())
	}
	DB = dbase
}

func ClearTable() {

}
