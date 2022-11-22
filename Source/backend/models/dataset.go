package models

type Dataset struct {
	ID           uint         `gorm:"primary_key;auto_increment" json:"id"`
	Name         string       `gorm:"not_null;type:varchar(50)" json:"name"`
	Description  string       `gorm:"type:text" json:"description"`
	Labels       string       `gorm:"type:text" json:"labels"`
	FileLocation string       `gorm:"not_nul;type:varchar(100)" json:"fileLocation"`
	Owner        string       `gorm:"not_null;type:varchar(20)" json:"owner"`
	Trained      bool         `gorm:"default:false" json:"trained"`
	Annotations  []Annotation `gorm:"ForeignKey:DatasetID"`
	BaseModel
}
