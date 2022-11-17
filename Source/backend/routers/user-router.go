package routers

import (
	"annotate-be/controllers"
	"github.com/gin-gonic/gin"
)

func UserRouter(engine *gin.Engine) {
	group := engine.Group("/user")
	{
		group.POST("/login", controllers.LoginController)
	}
}
