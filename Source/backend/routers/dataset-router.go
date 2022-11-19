package routers

import (
	"annotate-be/controllers"
	"github.com/gin-gonic/gin"
)

func DatasetRouter(engine *gin.Engine) {
	group := engine.Group("/datasets")
	{
		group.POST("", controllers.AddDataset)
		group.GET("", controllers.GetAllDataset)
		group.GET("/:id", controllers.GetDatasetById)
	}
}