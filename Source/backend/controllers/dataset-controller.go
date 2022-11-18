package controllers

import (
	"annotate-be/database"
	"annotate-be/models"
	"annotate-be/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
)

type newDatasetBody struct {
	DatasetName    string                `form:"dataset_name" binding:"required"`
	Metadata       string                `form:"metadata" binding:"required"`
	AnnotationFile *multipart.FileHeader `form:"annotation_file" binding:"required"`
	Owner          string                `form:"owner" binding:"required"`
}

func GetAllDataset(ctx *gin.Context) {
	var datasets []models.Dataset
	if err := database.DB.Find(&datasets).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}

	ctx.JSON(200, gin.H{
		"message": "berasil get all datasets",
		"data":    datasets,
	})
}

func GetDatasetById(ctx *gin.Context) {
	var dataset models.Dataset

	if err := database.DB.Where("id = ?", ctx.Param("id")).First(&dataset).Error; err != nil {
		ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("dataset tidak ditemukan"))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil dapat dataset by id",
		"data":    dataset,
	})
}

func AddDataset(ctx *gin.Context) {
	var body newDatasetBody
	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(400, utils.ExceptionResponse("jangan lupa terkait venue dsb"))
	}

	//Upload dataset to storage
	uploadedFile, e := ctx.FormFile("annotation_file")
	if e != nil {
		ctx.JSON(500, utils.ErrorResponse(e))
	}

	openedFile, _ := uploadedFile.Open()
	ioutil.ReadAll(openedFile)

	//write to disk
	newUUID, err := exec.Command("uuidgen").Output()
	newUUID = []byte(strings.TrimSuffix(fmt.Sprintf("%s", newUUID), "\n"))
	storageLoc := fmt.Sprintf("storage/%s%s", newUUID, filepath.Ext(uploadedFile.Filename))
	err = ctx.SaveUploadedFile(uploadedFile, storageLoc)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}

	//Save to database
	new_dataset := models.Dataset{
		Name:         body.DatasetName,
		Metadata:     body.Metadata,
		FileLocation: storageLoc,
		Owner:        body.Owner,
	}
	database.DB.Create(&new_dataset)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil tambah dataset baru",
		"data":    new_dataset,
	})
}
