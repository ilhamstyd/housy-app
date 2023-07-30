package models

import "time"

type User struct {
	ID       int    `json:"id" gorm:"primary_key:auto_increment"`
	Fullname string `json:"fullname" gorm:"type: varchar(255)"`
	Username string `json:"username" gorm:"type: varchar(255)"`
	Email    string `json:"email" gorm:"type: varchar(255)"`
	Password string `json:"password" gorm:"type: varchar(255)"`
	Phone    string `json:"phone" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"type: varchar(255)"`
	Image    string `json:"image" gorm:"type: varchar(255)"`

	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type UserResponse struct {
	ID       int    `json:"id" gorm:"primary_key:auto_increment"`
	Fullname string `json:"fullname" gorm:"type: varchar(255)"`
	Username string `json:"username" gorm:"type: varchar(255)"`
	Email    string `json:"email" gorm:"type: varchar(255)"`
	Phone    string `json:"phone" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"type: varchar(255)"`
}

func (UserResponse) TableName() string {
	return "users"
}
