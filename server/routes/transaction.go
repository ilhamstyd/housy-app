package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	TransactionRepository := repositories.RepositoryTransaction(mysql.DB)
	UserRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerTransaction(TransactionRepository, UserRepository)

	e.GET("/transactions", h.FindTransactions)
	e.GET("/transaction/:id", h.GetTransaction)
	e.POST("/transaction", middleware.Auth(h.CreateTransaction))
	e.DELETE("/transaction/:id", h.DeleteTransaction)
	e.GET("/transaction-client", middleware.Auth(h.GetTransactionByClient))
}
