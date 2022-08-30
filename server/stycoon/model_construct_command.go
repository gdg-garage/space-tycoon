/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type ConstructCommand struct {

	ShipClass *string `json:"ship-class"`

	Type string `json:"type,omitempty"`
}

// AssertConstructCommandRequired checks if the required fields are not zero-ed
func AssertConstructCommandRequired(obj ConstructCommand) error {
	elements := map[string]interface{}{
		"ship-class": obj.ShipClass,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecurseConstructCommandRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of ConstructCommand (e.g. [][]ConstructCommand), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseConstructCommandRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aConstructCommand, ok := obj.(ConstructCommand)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertConstructCommandRequired(aConstructCommand)
	})
}
