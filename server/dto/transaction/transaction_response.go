package transactiondto

type ResponseTransaction struct {
	ID            int    `json:"id" `
	CheckIn       string `json:"check_in" gorm:"type: varchar(255)"`
	CheckOut      string `json:"check_out" gorm:"type: varchar(255)"`
	HouseID       int    `json:"house_id" gorm:"type: int"`
	UserID        int    `json:"user_id" gorm:"type: int"`
	Total         int    `json:"total" gorm:"type: int"`
	StatusPayment string `json:"status_payment" gorm:"type: varchar(255)"`
}
