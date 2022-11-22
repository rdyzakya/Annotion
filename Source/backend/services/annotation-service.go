package services

import (
	"annotate-be/database"
	"annotate-be/models"
	"bytes"
	"encoding/csv"
	"encoding/json"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type AnnotateResponseResult struct {
	Labels []string
}

func AnnotationService(filename string, id uint, trained bool, label []string) []models.Annotation {
	csvFile, err := os.Open(filename)
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

	nLabel := len(label)
	var trainData = []string{}
	var predictData = []string{}
	var newLabels = label

	for i, line := range csvLines {
		if i < nLabel {
			trainData = append(trainData, line[0])
		} else {
			predictData = append(predictData, line[0])
		}
	}

	// Get data from database and mix it
	var annotations []models.Annotation
	if err := database.DB.Where("user_label IS NOT NULL").Find(&annotations).Error; err != nil {
		log.Println(err)
		return nil
	}
	for _, an := range annotations {
		predictData = append(predictData, an.Text)
		newLabels = append(newLabels, an.UserLabel)
	}

	// Request data from ML Engine
	mlUrl := os.Getenv("ANNOTATE_SERVER")
	bodyData := map[string]interface{}{
		"annotated_text":    trainData,
		"annotated_labels":  newLabels,
		"text_to_reccomend": predictData,
	}

	jsonVal, _ := json.Marshal(bodyData)
	req, err := http.NewRequest("POST", mlUrl+"text-reccomendation-lite", bytes.NewBuffer(jsonVal))
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		var dataResponse AnnotateResponseResult

		body, err := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &dataResponse)
		if err != nil {
			log.Println(err)
			return nil
		}
		// Save data into database
		var insertionData = []models.Annotation{}
		for i, d := range predictData {
			insertionData = append(insertionData, models.Annotation{
				Text:         d,
				TrainedLabel: dataResponse.Labels[i],
				DatasetID:    id,
			})
		}

		for i, d := range trainData {
			insertionData = append(insertionData, models.Annotation{
				Text:         d,
				TrainedLabel: label[i],
				DatasetID:    id,
			})
		}

		e := database.DB.Transaction(func(tx *gorm.DB) error {
			e := tx.Create(&insertionData).Error
			if e != nil {
				return e
			}

			if e := tx.Model(&models.Dataset{}).Where("id = ?", id).Update("trained", true).Error; e != nil {
				return e
			}
			return nil
		})
		if e != nil {
			log.Println(e)
			return nil
		}

		return insertionData
	} else {
		return nil
	}
}
