package database

import (
	"annotate-be/models"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

func DBSetupMain() {

	err := godotenv.Load(".env")

	if err != nil {
		panic("gawatt, env tidak terdeteksii")
	}

	dbUsn := os.Getenv("DBUSN")
	dbPass := os.Getenv("DBPASS")
	dbHost := os.Getenv("DBHOST")
	dbPort := os.Getenv("DBPORT")
	dbName := os.Getenv("DBNAME")

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUsn, dbPass, dbHost, dbPort, dbName)

	dbase, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})

	if err != nil {
		panic("Failed connect to database -> " + err.Error())
	}

	err = dbase.AutoMigrate(&models.Dataset{})
	if err != nil {
		panic("Migration DB error: " + err.Error())
	}

	DB = dbase
}

//func DBSetupTest() {
//	err := godotenv.Load(".env")
//
//	if err != nil {
//		panic("gawatt, env tidak terdeteksii")
//	}
//
//	dbUsn := os.Getenv("DBUSN_TEST")
//	dbPass := os.Getenv("DBPASS_TEST")
//	dbHost := os.Getenv("DBHOST_TEST")
//	dbPort := os.Getenv("DBPORT_TEST")
//	dbName := os.Getenv("DBNAME_TEST")
//
//	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUsn, dbPass, dbHost, dbPort, dbName)
//
//	dbase, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
//
//	if err != nil {
//		panic("Failed connect to database -> " + err.Error())
//	}
//
//	err = dbase.AutoMigrate(&models.Dataset{})
//	if err != nil {
//		panic("Migration DB error: " + err.Error())
//	}
//
//	DB = dbase
//}

func ClearTable() {

}
