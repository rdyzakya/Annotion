package main

import (
	"annotate-be/database"
	"annotate-be/middlewares"
	"annotate-be/routers"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())

	routers.UserRouter(r)
	routers.DatasetRouter(r)
	routers.FileGetterRoute(r)

	/*FOR TESTING PURPOSE*/
	r.GET("/", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"test": "backend  is running",
		})
	})

	/*Connect to database*/
	database.DBSetupMain()

	/*Running Server*/
	if err := r.Run("0.0.0.0:8010"); err != nil {
		fmt.Println(err)
		panic("ada error kawan")
	}
}
