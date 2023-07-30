package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/labstack/echo/v4"
)

func HouseRoutes(e *echo.Group) {
	HouseRepository := repositories.RepositoryHouse(mysql.DB)
	h := handlers.HandlerHouse(HouseRepository)

	e.POST("/house", middleware.UploadFile(h.CreateHouse))
	e.GET("/house/:id", h.GetHouse)
	e.GET("/houses", h.FindHouse)
	e.GET("/house", h.FilterHouse)
	e.GET("/filterside", h.FilterSide)
	e.GET("/filtercity", h.FilterCity)

}
