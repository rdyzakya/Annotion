package utils

import (
	"github.com/gin-gonic/gin"
)

func ErrorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

func ExceptionResponse(errMessage string) gin.H {
	return gin.H{
		"message": errMessage,
	}
}
