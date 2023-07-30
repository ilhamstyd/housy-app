package handlers

import (
	dto "housy/dto/result"
	transactiondto "housy/dto/transaction"
	"housy/models"
	"housy/repositories"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
	UserRepository        repositories.UserRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository, UserRepository repositories.UserRepository) *handlerTransaction {
	return &handlerTransaction{
		TransactionRepository: TransactionRepository,
		UserRepository:        UserRepository,
	}
}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	HouseID, _ := strconv.Atoi(c.FormValue("house_id"))
	TotalDuration, _ := strconv.Atoi(c.FormValue("total_duration"))
	// CheckIn, _ := strconv.Atoi(c.FormValue("check_in"))
	// CheckOut, _ := strconv.Atoi(c.FormValue("check_out"))
	price, _ := strconv.Atoi(c.FormValue("price"))
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	request := transactiondto.RequestTransaction{
		HouseID:       HouseID,
		UserID:        int(userId),
		TotalDuration: TotalDuration,
		CheckIn:       c.FormValue("check_in"),
		CheckOut:      c.FormValue("check_out"),
		Price:         price,
		// CheckIn: CheckIn,
		// CheckOut: CheckOut,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transaction := models.Transaction{
		CheckIn:       request.CheckIn,
		CheckOut:      request.CheckOut,
		UserID:        request.UserID,
		HouseID:       request.HouseID,
		TotalDuration: request.TotalDuration,
		Status:        "pending",
		Price:         request.Price,
	}

	data, err := h.TransactionRepository.CreateTransaction(transaction)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: "error ya bossss"})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: data})

}

func (h *handlerTransaction) FindTransactions(c echo.Context) error {
	transaction, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	// for i, p := range transaction {
	// 	transaction[i].Image = send_file + p.Image
	// }

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transaction})
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: transaction})
}

func (h *handlerTransaction) DeleteTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	data, err := h.TransactionRepository.DeleteTransaction(transaction, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: data})
}

func (h *handlerTransaction) GetTransactionByClient(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	transaction, err := h.TransactionRepository.GetTransactionByClient(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: transaction})
}
