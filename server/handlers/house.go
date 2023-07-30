package handlers

import (
	"context"
	"fmt"
	dto "housy/dto/result"
	"housy/models"
	"housy/repositories"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/datatypes"
)

type handlerHouse struct {
	HouseRepository repositories.HouseRepository
}

func HandlerHouse(HouseRepository repositories.HouseRepository) *handlerHouse {
	return &handlerHouse{HouseRepository}
}

func (h *handlerHouse) CreateHouse(c echo.Context) error {

	bedroom, err := strconv.Atoi(c.FormValue("bedroom"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error1"})
	}
	bathroom, err := strconv.Atoi(c.FormValue("bathroom"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error2"})
	}
	price, err := strconv.Atoi(c.FormValue("price"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error3"})
	}

	ctx := context.Background()
	CLOUD_NAME := os.Getenv("CLOUD_NAME")
	API_KEY := os.Getenv("API_KEY")
	API_SECRET := os.Getenv("API_SECRET")
	dataFile := c.Get("dataFile").(string)

	cldnr, err := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error4"})
	}
	resp, err := cldnr.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "ilham_housy"})
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error5"})
	}

	house := models.House{
		Name:        c.FormValue("name"),
		CityName:    c.FormValue("city_name"),
		Address:     c.FormValue("address"),
		Price:       price,
		TypeRent:    c.FormValue("type_rent"),
		Amenities:   datatypes.JSON(c.FormValue("amenities")),
		Bedroom:     bedroom,
		Bathroom:    bathroom,
		Area:        c.FormValue("area"),
		Image:       resp.SecureURL,
		Description: c.FormValue("description"),
	}

	validation := validator.New()
	jerr := validation.Struct(house)
	if jerr != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	data, err := h.HouseRepository.CreateHouse(house)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: data})
}

func (h *handlerHouse) FindHouse(c echo.Context) error {
	house, err := h.HouseRepository.FindHouse()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: house, Message: "SUCCESS"})
}

func (h *handlerHouse) GetHouse(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	house, err := h.HouseRepository.GetHouse(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: house})
}

func (h *handlerHouse) FilterHouse(c echo.Context) error {

	bedroomParam := c.QueryParam("bedroom")
	bathroomParam := c.QueryParam("bathroom")
	CityNameParam := c.QueryParam("city_name")
	typeRent := c.QueryParam("type_rent")
	price, _ := strconv.Atoi(c.QueryParam("price"))

	fmt.Println("ini param :", bedroomParam, bathroomParam, CityNameParam, typeRent, price)

	var bedroom int
	if bedroomParam != "" {
		var err error
		bedroom, err = strconv.Atoi(bedroomParam)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}
	}
	var bathroom int
	if bathroomParam != "" {
		var err error
		bathroom, err = strconv.Atoi(bathroomParam)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}
	}

	house, err := h.HouseRepository.FilterHouse(CityNameParam, typeRent, bedroom, bathroom, price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Message: "SUCCESS", Data: house})

}

func (h *handlerHouse) FilterCity(c echo.Context) error {
	cityName := c.QueryParam("city_name")

	properties, err := h.HouseRepository.FilterCity(cityName)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "errornih"})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: properties})
}

func (h *handlerHouse) FilterSide(c echo.Context) error {
	TypeRent := c.QueryParam("type_rent")
	Bedroom, _ := strconv.Atoi(c.QueryParam("bedroom"))
	Bathroom, _ := strconv.Atoi(c.QueryParam("bathroom"))
	Price, _ := strconv.Atoi(c.QueryParam("price"))

	properties, err := h.HouseRepository.FilterSide(TypeRent, Bathroom, Bedroom, Price)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadGateway, Message: "disini errornya guy"})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: properties})
}
