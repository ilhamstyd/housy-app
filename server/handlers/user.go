package handlers

import (
	"context"
	authdto "housy/dto/auth"
	dto "housy/dto/result"
	usersdto "housy/dto/user"
	"housy/models"
	"housy/pkg/bcrypt"
	"housy/repositories"
	"net/http"
	"os"
	"strconv"

	// "github.com/go-playground/validator/v10"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// var path_file = "http://localhost:5000/uploads/"

type handlerUser struct {
	UserRepository repositories.UserRepository
}

func HandlerUser(UserRepository repositories.UserRepository) *handlerUser {
	return &handlerUser{UserRepository}
}

func (h *handlerUser) UpdateUser(c echo.Context) error {

	request := new(usersdto.UserRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))

	user, err := h.UserRepository.GetUserID(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Fullname != "" {
		user.Fullname = request.Fullname
	}

	if request.Email != "" {
		user.Email = request.Email
	}

	if request.Phone != "" {
		user.Phone = request.Phone
	}
	if request.Image != "" {
		user.Image = request.Image
	}

	data, err := h.UserRepository.UpdateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerUser) GetUser(c echo.Context) error {

	id, _ := strconv.Atoi(c.Param("id"))

	var user models.User
	user, err := h.UserRepository.GetUserID(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: "salahcoy",
		})
	}
	user.Image = os.Getenv("PATH_FILE") + user.Image

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code:    http.StatusAccepted,
		Status:  "SUCCESS",
		Message: "SUCCESS",
		Data:    user,
	})
}

func (h *handlerUser) FindUsers(c echo.Context) error {

	users, err := h.UserRepository.FindUsers()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: "salahcoy",
		})
	}

	for i, u := range users {
		imagePath := os.Getenv("PATH_FILE") + u.Image
		users[i].Image = imagePath
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code:    http.StatusAccepted,
		Message: "success",
		Data:    users,
	})
}

func (h *handlerUser) ChangeImage(c echo.Context) error {
	dataFile := c.Get("dataFile").(string)
	request := usersdto.ChangeImageRequest{
		Image: dataFile,
	}

	ctx := context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	resp, _ := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "ilham_housy"})

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	user, err := h.UserRepository.GetUserID(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Image != "" {
		user.Image = resp.SecureURL
	}

	data, err := h.UserRepository.ChangeImage(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code:    http.StatusAccepted,
		Message: "success change photo",
		Data:    data,
	})
}

func (h *handlerUser) ChangePassword(c echo.Context) error {

	request := new(authdto.ChangePasswordRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	user, err := h.UserRepository.GetUserID(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Status: http.StatusBadGateway, Message: err.Error()})
	}
	isValid := bcrypt.CheckPasswordHash(request.OldPassword, user.Password)
	if !isValid {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Status: http.StatusBadGateway, Message: err.Error()})
	}

	newPassword, err := bcrypt.HashingPassword(request.NewPassword)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	user.Password = newPassword
	data, err := h.UserRepository.ChangePassword(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code:    http.StatusAccepted,
		Message: "success change password",
		Data:    data,
	})
}
