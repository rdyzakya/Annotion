package services

import (
	"encoding/csv"
	"log"
	"os"
)

type CsvReaderReturn struct {
	Columns  []string
	Rows     []map[string]string
	nRows    int
	nColumns int
}

func CsvReaderService(fileloc string) *CsvReaderReturn {
	csvFile, err := os.Open(fileloc)
	if err != nil {
		log.Println(err)
		return nil
	}
	//Reading CSV
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		log.Println(err)
		return nil
	}

	var col []string
	var rows []map[string]string
	for i, line := range csvLines {
		if i == 0 {
			for _, c := range line {
				col = append(col, c)
			}
		} else {
			var mp = make(map[string]string)
			for j, c := range line {
				//fmt.Println(j)
				mp[csvLines[0][j]] = c
			}
			rows = append(rows, mp)
		}
	}

	var res CsvReaderReturn = CsvReaderReturn{
		Columns:  col,
		Rows:     rows,
		nColumns: len(col),
		nRows:    len(rows),
	}

	return &res
}
