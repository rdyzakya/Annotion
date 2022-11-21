package controllers

import (
	"annotate-be/database"
	"annotate-be/models"
	"annotate-be/services"
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
	DatasetName    string                `form:"dataset_name"`
	Description    string                `form:"description" `
	Labels         string                `form:"labels" `
	AnnotationFile *multipart.FileHeader `form:"annotation_file"`
	Owner          string                `form:"owner" `
}

func GetAllDataset(ctx *gin.Context) {
	var datasets []models.Dataset
	var owner, hasOwner = ctx.GetQuery("owner")
	if err := database.DB.Where(utils.IfThenElse(hasOwner, "owner = ? ", "1 = ?"), utils.IfThenElse(hasOwner, owner, 1)).Find(&datasets).Error; err != nil {
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
	var owner, hasOwner = ctx.GetQuery("owner")
	if err := database.DB.Where(utils.IfThenElse(hasOwner, "id = ? and owner = ?", "id = ? and 1="+
		"?"), ctx.Param("id"), utils.IfThenElse(hasOwner, owner, 1)).First(&dataset).Error; err != nil {
		ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("dataset tidak ditemukan"))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil dapat dataset by id",
		"data":    dataset,
	})
}

func DeleteDatasetById(ctx *gin.Context) {
	var dataset models.Dataset
	var owner, hasOwner = ctx.GetQuery("owner")
	if err := database.DB.Where(utils.IfThenElse(hasOwner, "id = ? and owner = ?", "id = ? and 1="+
		"?"), ctx.Param("id"), utils.IfThenElse(hasOwner, owner, 1)).First(&dataset).Error; err != nil {
		ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("dataset tidak ditemukan"))
		return
	}

	if err := database.DB.Delete(&dataset).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil menghapus dataset",
		"data":    dataset,
	})
}

func AddDataset(ctx *gin.Context) {
	var body newDatasetBody
	if err := ctx.ShouldBind(&body); err != nil {
		fmt.Println(err)
		ctx.JSON(400, utils.ExceptionResponse("data kurang lengkap"))
		return
	}
	fmt.Println(body)
	//Upload dataset to storage
	uploadedFile, e := ctx.FormFile("annotation_file")
	if e != nil {
		fmt.Println(e)
		ctx.JSON(500, utils.ErrorResponse(e))
		return
	}

	openedFile, _ := uploadedFile.Open()
	ioutil.ReadAll(openedFile)

	//write to disk
	newUUID, err := exec.Command("uuidgen").Output()
	newUUID = []byte(strings.TrimSuffix(fmt.Sprintf("%s", newUUID), "\n"))
	extension := filepath.Ext(uploadedFile.Filename)
	if extension != ".csv" {
		ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("format should be in csv"))
		return
	}
	storageLoc := fmt.Sprintf("storage/%s%s", newUUID, extension)
	err = ctx.SaveUploadedFile(uploadedFile, storageLoc)
	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}

	//Save to database
	new_dataset := models.Dataset{
		Name:         body.DatasetName,
		Description:  body.Description,
		Labels:       body.Labels,
		FileLocation: storageLoc,
		Owner:        body.Owner,
	}
	database.DB.Create(&new_dataset)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil tambah dataset baru",
		"data":    new_dataset,
	})
}

func ExtractCsvDataset(ctx *gin.Context) {
	var dataset models.Dataset
	var owner, hasOwner = ctx.GetQuery("owner")
	if err := database.DB.Where(utils.IfThenElse(hasOwner, "id = ? and owner = ?", "id = ? and 1="+
		"?"), ctx.Param("id"), utils.IfThenElse(hasOwner, owner, 1)).First(&dataset).Error; err != nil {
		ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("dataset tidak ditemukan"))
		return
	}
	extraction := services.CsvReaderService(dataset.FileLocation)
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "berhasil extract csv",
		"extraction": extraction,
		"data":       dataset,
	})
}
