package stycoon

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func IsPasswordValid(hash []byte, pass []byte) error {
	return bcrypt.CompareHashAndPassword(hash, pass)
}
