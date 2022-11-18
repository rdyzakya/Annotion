package models

type Dataset struct {
	ID           uint   `gorm:"primary_key;auto_increment" json:"id"`
	Name         string `gorm:"not_null" json:"name"`
	Metadata     string `gorm:"type:text" json:"metadata"`
	FileLocation string `gorm:"not_null" json:"fileLocation"`
	Owner        string `gorm:"not_null" json:"owner"`
	BaseModel
}
