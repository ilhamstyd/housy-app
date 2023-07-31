package middleware

import (
	"context"
	dto "housy/dto/result"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		file, err := c.FormFile("image")
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		src, err := file.Open()
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		defer src.Close()

		ctx := context.Background()
		CLOUD_NAME := os.Getenv("CLOUD_NAME")
		API_KEY := os.Getenv("API_KEY")
		API_SECRET := os.Getenv("API_SECRET")

		cldnr, err := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error4"})
		}
		resp, err := cldnr.Upload.Upload(ctx, src, uploader.UploadParams{Folder: "ilham_housy"})
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "error5"})
		}

		c.Set("dataFile", resp.SecureURL)
		return next(c)
	}
}
