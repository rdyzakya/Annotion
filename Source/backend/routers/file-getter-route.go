package routers

import (
	"annotate-be/utils"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
)

func FileGetterRoute(engine *gin.Engine) {
	engine.GET("/storage/:flname", func(ctx *gin.Context) {
		flname := ctx.Param("flname")
		fBytes, err := ioutil.ReadFile("storage/" + flname)
		if err != nil {
			ctx.JSON(http.StatusNotFound, utils.ExceptionResponse("file not found!"))
			return
		}

		ctx.Header("Content-Type", "application/octet-stream")

		_, err = ctx.Writer.Write(fBytes)
		if err != nil {
			ctx.Writer.WriteHeader(http.StatusInternalServerError)
		} else {
			ctx.Writer.WriteHeader(http.StatusOK)
		}
	})
}
