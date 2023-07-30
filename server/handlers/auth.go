package handlers

import (
	authdto "housy/dto/auth"
	dto "housy/dto/result"
	"log"
	"net/http"
	"time"

	"housy/models"
	"housy/pkg/bcrypt"
	jwtToken "housy/pkg/jwt"
	"housy/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// var path_file = "http://localhost:5000/uploads/"

type handlerAuth struct {
	AuthRepository repositories.AuthRepository
}

func HandlerAuth(AuthRepository repositories.AuthRepository) *handlerAuth {
	return &handlerAuth{AuthRepository}

}

func (h *handlerAuth) Register(c echo.Context) error {

	request := new(authdto.RegisterRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	password, err := bcrypt.HashingPassword(request.Password)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	user := models.User{
		Fullname: request.Fullname,
		Username: request.Username,
		Email:    request.Email,
		Password: password,
		Phone:    request.Phone,
		Role:     "user",
	}

	data, err := h.AuthRepository.Register(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Message: "Your registration is successful", Data: data})
}

func (h *handlerAuth) Login(c echo.Context) error {
	request := new(authdto.LoginRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	user := models.User{
		Username: request.Username,
		Password: request.Password,
	}

	user, err := h.AuthRepository.Login(user.Username)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	isValid := bcrypt.CheckPasswordHash(request.Password, user.Password)
	if !isValid {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "wrong email or password"})
	}

	claims := jwt.MapClaims{}
	claims["id"] = user.ID
	// claims["is_admin"] = user.IsAdmin
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix() // 2 hours expired
	token, errGenerateToken := jwtToken.GenerateToken(&claims)
	if errGenerateToken != nil {
		log.Println(errGenerateToken)
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	loginResponse := authdto.LoginResponse{
		Fullname: user.Fullname,
		Username: user.Username,
		Email:    user.Email,
		Token:    token,
		Role:     user.Role,
		Image:    user.Image,
	}

	return c.JSON(http.StatusOK,
		dto.SuccessResult{
			Code:    http.StatusAccepted,
			Status:  "SUCCESS",
			Message: "You have successfully logged in",
			Data:    loginResponse})
}

func (h *handlerAuth) CheckAuth(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	//check user by id
	user, err := h.AuthRepository.GetUser(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	ChechAuthResponse := authdto.ChechAuthResponse{
		Id:       user.ID,
		Fullname: user.Fullname,
		Username: user.Username,
		Phone:    user.Phone,
		Email:    user.Email,
		Role:     user.Role,
		Image:    user.Image,
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "SUCCESS", Data: ChechAuthResponse})
}
