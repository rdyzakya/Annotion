package controllers

import (
	"annotate-be/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

type User struct {
	username string
	password string
}

type userBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var userAccounts = [3]User{
	{
		username: "tester",
		password: "asdf1234",
	},
	{
		username: "randytampan",
		password: "hello123",
	},
	{
		username: "syamilkolid",
		password: "deadwood",
	},
}

func LoginController(ctx *gin.Context) {
	var body userBody

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}

	for _, userData := range userAccounts {
		if body.Password == userData.password && body.Username == userData.username {
			ctx.JSON(http.StatusOK, gin.H{
				"message": "login berhasil",
			})
			return
		}
	}

	ctx.JSON(http.StatusUnauthorized, gin.H{
		"message": "login gagal, username atau pass salah",
	})
}
