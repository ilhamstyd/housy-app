package transactiondto

type RequestTransaction struct {
	CheckIn       string `json:"check_in" form:"check_in"`
	CheckOut      string `json:"check_out" form:"check_out"`
	HouseID       int    `json:"house_id" form:"house_id"`
	UserID        int    `json:"user_id" form:"user_id"`
	TotalDuration int    `json:"total_duration" form:"total_duration"`
	Status        string `json:"status" form:"status"`
	Price         int    `json:"price" form:"price"`
}
