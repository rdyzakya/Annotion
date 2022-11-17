package models

import (
	"gorm.io/gorm"
	"time"
)

type Dataset struct {
	ID           uint      `gorm:"primary_key;auto_increment" json:"id"`
	Name         string    `gorm:"not_null" json:"name"`
	Metadata     string    `gorm:"type:text" json:"metadata"`
	FileLocation string    `gorm:"not_null" json:"fileLocation"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt
}
