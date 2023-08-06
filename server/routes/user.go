package routes

import (
	"housy/handlers"
	// "housy/pkg/middleware"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	UsersRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(UsersRepository)

	e.PATCH("/user/:id", h.UpdateUser)
	e.GET("/user", h.GetUser)
	e.GET("/users", h.FindUsers)
	e.PATCH("/change-image", middleware.Auth(middleware.UploadImage(h.ChangeImage)))
	e.PATCH("/change-password", middleware.Auth(h.ChangePassword))
}
