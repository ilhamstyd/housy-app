package handlers

import (
	"fmt"
	dto "housy/dto/result"
	transactiondto "housy/dto/transaction"
	"housy/models"
	"housy/repositories"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
	UserRepository        repositories.UserRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository, UserRepository repositories.UserRepository) *handlerTransaction {
	return &handlerTransaction{
		TransactionRepository: TransactionRepository,
		UserRepository:        UserRepository,
	}
}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	HouseID, _ := strconv.Atoi(c.FormValue("house_id"))
	TotalDuration, _ := strconv.Atoi(c.FormValue("total_duration"))
	price, _ := strconv.Atoi(c.FormValue("price"))
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	var transactionIsMatch = false
	var transactionId int
	for !transactionIsMatch {
		transactionId = int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(transactionId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}

	request := transactiondto.RequestTransaction{
		HouseID:       HouseID,
		UserID:        int(userId),
		TotalDuration: TotalDuration,
		CheckIn:       c.FormValue("check_in"),
		CheckOut:      c.FormValue("check_out"),
		Price:         price,
		// CheckIn: CheckIn,
		// CheckOut: CheckOut,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transaction := models.Transaction{
		CheckIn:       request.CheckIn,
		CheckOut:      request.CheckOut,
		UserID:        request.UserID,
		HouseID:       request.HouseID,
		TotalDuration: request.TotalDuration,
		Status:        "pending",
		Price:         request.Price,
	}

	data, err := h.TransactionRepository.CreateTransaction(transaction)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: "error ya bossss"})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: data})

}

func (h *handlerTransaction) FindTransactions(c echo.Context) error {
	transaction, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	// for i, p := range transaction {
	// 	transaction[i].Image = send_file + p.Image
	// }

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transaction})
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: transaction})
}

func (h *handlerTransaction) DeleteTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	data, err := h.TransactionRepository.DeleteTransaction(transaction, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: data})
}

func (h *handlerTransaction) GetTransactionByClient(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	transaction, err := h.TransactionRepository.GetTransactionByClient(userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Status: "SUCCESS", Data: transaction})
}

func (h *handlerTransaction) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	order_id, _ := strconv.Atoi(orderId)

	fmt.Println("Ini payloadnya, boss!", notificationPayload)

	transaction, _ := h.TransactionRepository.GetTransaction(order_id)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateTransaction("pending", order_id)
		} else if fraudStatus == "accept" {
			SendMail("success", transaction)
			h.TransactionRepository.UpdateTransaction("success", order_id)
		}
	} else if transactionStatus == "settlement" {
		SendMail("success", transaction)
		h.TransactionRepository.UpdateTransaction("success", order_id)
	} else if transactionStatus == "deny" {
		h.TransactionRepository.UpdateTransaction("failed", order_id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.TransactionRepository.UpdateTransaction("failed", order_id)
	} else if transactionStatus == "pending" {
		h.TransactionRepository.UpdateTransaction("pending", order_id)
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: notificationPayload})

}

// GetPayment
func (h *handlerTransaction) GetPayment(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)
	fmt.Println(transaction)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// 1. Initiate Snap client
	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(transaction.ID),
			GrossAmt: int64(transaction.Price),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: transaction.User.Fullname,
			Email: transaction.User.Email,
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: snapResp})
}

func SendMail(status string, transaction models.Transaction) {

	if status != transaction.Status && (status == "success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "HOUSY <housy@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

		var HouseName = transaction.House.Name
		var price = strconv.Itoa(transaction.Price)
		var Name = transaction.User.Username

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
		<html>
		<head>
		  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		  <title>Housy By Ilham </title>
		  <style>
			img {
			  border: none;
			  -ms-interpolation-mode: bicubic;
			  max-width: 100vw; 
			}
	  
			body {
			  background-color: #f6f6f6;
			  font-family: sans-serif;
			  -webkit-font-smoothing: antialiased;
			  font-size: 14px;
			  line-height: 1.4;
			  margin: 0;
			  padding: 0;
			  -ms-text-size-adjust: 100vw;
			  -webkit-text-size-adjust: 100vw; 
			}
	  
			table {
			  border-collapse: separate;
			  mso-table-lspace: 0pt;
			  mso-table-rspace: 0pt;
			  width: 100vw; }
			  table td {
				font-family: sans-serif;
				font-size: 14px;
				vertical-align: top; 
			}
	  
			.body {
			  background-color: #f6f6f6;
			  width: 100vw; 
			}
	  
			.container {
			  display: block;
			  margin: 0 auto !important;
			  /* makes it centered */
			  max-width: 580px;
			  padding: 10px;
			  width: 580px; 
			}
	  
			.content {
			  box-sizing: border-box;
			  display: block;
			  margin: 0 auto;
			  max-width: 580px;
			  padding: 10px; 
			}
			.main {
			  background: #ffffff;
			  border-radius: 3px;
			  width: 100vw; 
			}
	  
			.wrapper {
			  box-sizing: border-box;
			  padding: 20px; 
			}
	  
			.content-block {
			  padding-bottom: 10px;
			  padding-top: 10px;
			}
	  
			.footer {
			  clear: both;
			  margin-top: 10px;
			  text-align: center;
			  width: 100vw; 
			}
			  .footer td,
			  .footer p,
			  .footer span,
			  .footer a {
				color: #999999;
				font-size: 12px;
				text-align: center; 
			}
	  
			h1,
			h2,
			h3,
			h4 {
			  color: #000000;
			  font-family: sans-serif;
			  font-weight: 400;
			  line-height: 1.4;
			  margin: 0;
			  margin-bottom: 30px; 
			}
	  
			h1 {
			  font-size: 35px;
			  font-weight: 300;
			  text-align: center;
			  text-transform: capitalize; 
			}
	  
			p,
			ul,
			ol {
			  font-family: sans-serif;
			  font-size: 14px;
			  font-weight: normal;
			  margin: 0;
			  margin-bottom: 15px; 
			}
			  p li,
			  ul li,
			  ol li {
				list-style-position: inside;
				margin-left: 5px; 
			}
	  
			a {
			  color: #3498db;
			  text-decoration: underline; 
			}
	  
			.btn {
			  box-sizing: border-box;
			  width: 100vw; }
			  .btn > tbody > tr > td {
				padding-bottom: 15px; }
			  .btn table {
				width: auto; 
			}
			  .btn table td {
				background-color: #ffffff;
				border-radius: 5px;
				text-align: center; 
			}
			  .btn a {
				background-color: #ffffff;
				border: solid 1px #3498db;
				border-radius: 5px;
				box-sizing: border-box;
				color: #3498db;
				cursor: pointer;
				display: inline-block;
				font-size: 14px;
				font-weight: bold;
				margin: 0;
				padding: 12px 25px;
				text-decoration: none;
				text-transform: capitalize; 
			}
	  
			.btn-primary table td {
			  background-color: #3498db; 
			}
	  
			.btn-primary a {
			  background-color: #3498db;
			  border-color: #3498db;
			  color: #ffffff; 
			}
			.last {
			  margin-bottom: 0; 
			}
	  
			.first {
			  margin-top: 0; 
			}
	  
			.align-center {
			  text-align: center; 
			}
	  
			.align-right {
			  text-align: right; 
			}
	  
			.align-left {
			  text-align: left; 
			}
	  
			.clear {
			  clear: both; 
			}
	  
			.mt0 {
			  margin-top: 0; 
			}
	  
			.mb0 {
			  margin-bottom: 0; 
			}
	  
			.preheader {
			  color: transparent;
			  display: none;
			  height: 0;
			  max-height: 0;
			  max-width: 0;
			  opacity: 0;
			  overflow: hidden;
			  mso-hide: all;
			  visibility: hidden;
			  width: 0; 
			}
	  
			.powered-by a {
			  text-decoration: none; 
			}
	  
			hr {
			  border: 0;
			  border-bottom: 1px solid #f6f6f6;
			  margin: 20px 0; 
			}
	  
			@media only screen and (max-width: 620px) {
			  table.body h1 {
				font-size: 28px !important;
				margin-bottom: 10px !important; 
			  }
			  table.body p,
			  table.body ul,
			  table.body ol,
			  table.body td,
			  table.body span,
			  table.body a {
				font-size: 16px !important; 
			  }
			  table.body .wrapper,
			  table.body .article {
				padding: 10px !important; 
			  }
			  table.body .content {
				padding: 0 !important; 
			  }
			  table.body .container {
				padding: 0 !important;
				width: 100vw !important; 
			  }
			  table.body .main {
				border-left-width: 0 !important;
				border-radius: 0 !important;
				border-right-width: 0 !important; 
			  }
			  table.body .btn table {
				width: 100vw !important; 
			  }
			  table.body .btn a {
				width: 100vw !important; 
			  }
			  table.body .img-responsive {
				height: auto !important;
				max-width: 100vw !important;
				width: auto !important; 
			  }
			}
	  
			/* -------------------------------------
				PRESERVE THESE STYLES IN THE HEAD
			------------------------------------- */
			@media all {
			  .ExternalClass {
				width: 100vw; 
			  }
			  .ExternalClass,
			  .ExternalClass p,
			  .ExternalClass span,
			  .ExternalClass font,
			  .ExternalClass td,
			  .ExternalClass div {
				line-height: 100vw; 
			  }
			  .apple-link a {
				color: inherit !important;
				font-family: inherit !important;
				font-size: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
				text-decoration: none !important; 
			  }
			  #MessageViewBody a {
				color: inherit;
				text-decoration: none;
				font-size: inherit;
				font-family: inherit;
				font-weight: inherit;
				line-height: inherit;
			  }
			  .btn-primary table td:hover {
				background-color: #34495e !important; 
			  }
			  .btn-primary a:hover {
				background-color: #34495e !important;
				border-color: #34495e !important; 
			  } 
			}
	  
		  </style>
		</head>
		<body>
		  <span class="preheader">Housy Pemesanan Hotel, Villa, Appartemen murah di seluruh indonesia.</span>
		  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
			<tr>
			  <td>&nbsp;</td>
			  <td class="container">
				<div class="content">
	  
				  <!-- START CENTERED WHITE CONTAINER -->
				  <table role="presentation" class="main">
	  
					<!-- START MAIN CONTENT AREA -->
					<tr>
					  <td class="wrapper">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0">
						  <tr>
							<td>
							  <p>Hi %s,</p>
							  <p>Terima kasih sudah memesan lewat Housy APP 😎.</p>
							  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
								<tbody>
								  <tr>
									<td align="left">
									  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
										<tbody>
										  <tr>
											<td> Product Name : %s </td><br>
											<td> Price : %s </td><br>
											<td> Status : %s </td>
										  </tr>
										</tbody>
									  </table>
									</td>
								  </tr>
								</tbody>
							  </table>
							  <p>Pembayaran Kamu Sudah Kami Terima !.</p>
							  <p>Semoga Harimu Menyenangkan 😁😊.</p>
							</td>
						  </tr>
						</table>
					  </td>
					</tr>
	  
				  <!-- END MAIN CONTENT AREA -->
				  </table>
				  <!-- END CENTERED WHITE CONTAINER -->
	  
				</div>
			  </td>
			  <td>&nbsp;</td>
			</tr>
		  </table>
		</body>
	  </html>`, Name, HouseName, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}
