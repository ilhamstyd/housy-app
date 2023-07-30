package main

import (
	"fmt"
	"housy/database"
	"housy/pkg/mysql"
	"housy/routes"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	godotenv.Load()

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{},
		AllowMethods: []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
	}))

	e.Static("/uploads", "/uploads")

	mysql.DatabaseInit()
	database.RunMigration()

	routes.RouteInit(e.Group("api/v1"))

	e.Logger.Fatal(e.Start(":5000"))
	fmt.Println("server running on localhost 5000 bosku😊")
}
