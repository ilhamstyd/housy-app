package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type HouseRepository interface {
	CreateHouse(house models.House) (models.House, error)
	FindHouse() ([]models.House, error)
	GetHouse(ID int) (models.House, error)
	UpdateHouse(house models.House) (models.House, error)
	FilterHouse(cityName, TypeRent string, bedroom, bathroom, price int) ([]models.House, error)
	FilterCity(cityName string) ([]models.House, error)
	FilterSide(TypeRent string, bathroom, bedroom, price int) ([]models.House, error)
}

func RepositoryHouse(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateHouse(house models.House) (models.House, error) {
	err := r.db.Create(&house).Error

	return house, err
}

func (r *repository) FindHouse() ([]models.House, error) {
	var house []models.House
	err := r.db.Find(&house).Error

	return house, err
}

func (r *repository) GetHouse(ID int) (models.House, error) {
	var house models.House
	err := r.db.First(&house, ID).Error

	return house, err
}

func (r *repository) UpdateHouse(house models.House) (models.House, error) {
	err := r.db.Save(&house).Error

	return house, err
}

func (r *repository) FilterHouse(cityName, TypeRent string, bedroom, bathroom, price int) ([]models.House, error) {
	var house []models.House
	err := r.db.Where("city_name = ? AND type_rent = ? AND bedroom = ? AND bathroom = ? AND price < ?", cityName, TypeRent, bedroom, bathroom, price).Find(&house).Error

	return house, err
}
func (r *repository) FilterCity(cityName string) ([]models.House, error) {
	var house []models.House
	err := r.db.Where("city_name = ? ", cityName).Find(&house).Error

	return house, err
}
func (r *repository) FilterSide(TypeRent string, bathroom, bedroom, price int) ([]models.House, error) {
	var house []models.House
	err := r.db.Where("type_rent = ? AND bathroom = ? AND bedroom = ? AND price < ?", TypeRent, bathroom, bedroom, price).Find(&house).Error

	return house, err
}
