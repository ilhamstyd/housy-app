package routes

import (
	"housy/handlers"
	"housy/pkg/mysql"
	"housy/repositories"

	"housy/pkg/middleware"

	"github.com/labstack/echo/v4"
)

func AuthRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryAuth(mysql.DB)
	h := handlers.HandlerAuth(userRepository)

	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.GET("/check-auth", middleware.Auth(h.CheckAuth))

}
