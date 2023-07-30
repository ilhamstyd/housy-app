package database

import (
	"fmt"
	"housy/models"
	"housy/pkg/mysql"
)

func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.User{},
		&models.House{},
		&models.Transaction{},
	)

	if err != nil {
		fmt.Println(err)
		panic("migration fail")
	}

	fmt.Println("migration success😂")
}
