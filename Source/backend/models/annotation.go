package models

type Annotation struct {
	ID           uint   `gorm:"primary_key;auto_increment" json:"id"`
	Text         string `gorm:"not_null" json:"text"`
	TrainedLabel string `gorm:"null;type:varchar(30)" json:"trainedLabel"`
	UserLabel    string `gorm:"null;type:varchar(30)" json:"userLabel"`

	DatasetID uint `gorm:"column:dataset_id"`
	Dataset   Dataset

	BaseModel
}
