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
	Type string `json:"type"`

	Target int64 `json:"target,omitempty"`

	Resource int64 `json:"resource,omitempty"`

	Amount int64 `json:"amount,omitempty"`

	ShipClass int64 `json:"ship-class"`
}

// AssertConstructCommandRequired checks if the required fields are not zero-ed
func AssertConstructCommandRequired(obj ConstructCommand) error {
	elements := map[string]interface{}{
		"type":       obj.Type,
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
