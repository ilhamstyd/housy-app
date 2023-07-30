package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetUserID(ID int) (models.User, error)
	FindUsers() ([]models.User, error)
	UpdateUser(user models.User) (models.User, error)
	ChangePassword(user models.User) (models.User, error)
	ChangeImage(user models.User) (models.User, error)
}

func RepositoryUser(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) UpdateUser(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error // Using Save method

	return user, err
}

func (r *repository) GetUserID(ID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, ID).Error

	return user, err
}

func (r *repository) FindUsers() ([]models.User, error) {
	var users []models.User

	err := r.db.Find(&users).Error

	return users, err
}

func (r *repository) ChangePassword(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error

	return user, err
}

func (r *repository) ChangeImage(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error

	return user, err
}
