package routers

import "github.com/gin-gonic/gin"

func FileGetterRoute(engine *gin.Engine) {
	engine.GET("/storage", func(ctx *gin.Context) {
		
	})
}
