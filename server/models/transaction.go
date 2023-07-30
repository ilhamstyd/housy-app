package models

import "time"

type Transaction struct {
	ID            int       `json:"id" gorm:"primary_key:auto_increment"`
	CheckIn       string    `json:"check_in"`
	CheckOut      string    `json:"check_out"`
	HouseID       int       `json:"house_id"`
	House         House     `json:"house"`
	UserID        int       `json:"user_id"`
	User          User      `json:"user"`
	TotalDuration int       `json:"total_duration"`
	Status        string    `json:"status"`
	Price         int       `json:"price"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
