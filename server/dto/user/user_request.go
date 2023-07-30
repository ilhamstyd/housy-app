package usersdto

type UserRequest struct {
	ID       int    `json:"id"`
	Fullname string `json:"fullname" form:"fullname" gorm:"type: varchar(255)"`
	Email    string `json:"email" form:"email" gorm:"type: varchar(255)"`
	Password string `json:"password" gorm:"type: varchar(255)"`
	Username string `json:"username" form:"username" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"type: varchar(225)"`
	Phone    string `json:"phone" form:"phone" gorm:"type: varchar(225)"`
	Image    string `json:"image" form:"image" gorm:"type: varchar(255)"`
}

type ChangeImageRequest struct {
	Image string `json:"image" form:"image" gorm:"type: varchar(255)"`
}
