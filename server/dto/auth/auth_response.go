package authdto

type RegisterResponse struct {
	Fullname string `json:"fullname" gorm:"type: varchar(255)"`
	Username string `json:"username" gorm:"type: varchar(255)"`
	Email    string `json:"email" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"type: varchar(255)"`
	// Photo    string `json:"photo" gorm:"type: varchar(255)"`
}

type LoginResponse struct {
	Fullname string `json:"fullname" gorm:"type: varchar(255)"`
	Username string `json:"username" gorm:"type: varchar(255)"`
	Email    string `json:"email" gorm:"type: varchar(255)"`
	Token    string `json:"token" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"type: varchar(255)"`
	Image    string `json:"image" gorm:"type: varchar(255)"`
}

type ChechAuthResponse struct {
	Id       int    `json:"id"`
	Fullname string `json:"fullname"`
	Username string `json:"username"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Image    string `json:"image"`
}
