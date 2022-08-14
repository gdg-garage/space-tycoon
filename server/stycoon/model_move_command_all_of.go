/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type MoveCommandAllOf struct {

	Destination Destination `json:"destination"`
}

// AssertMoveCommandAllOfRequired checks if the required fields are not zero-ed
func AssertMoveCommandAllOfRequired(obj MoveCommandAllOf) error {
	elements := map[string]interface{}{
		"destination": obj.Destination,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	if err := AssertDestinationRequired(obj.Destination); err != nil {
		return err
	}
	return nil
}

// AssertRecurseMoveCommandAllOfRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MoveCommandAllOf (e.g. [][]MoveCommandAllOf), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMoveCommandAllOfRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMoveCommandAllOf, ok := obj.(MoveCommandAllOf)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMoveCommandAllOfRequired(aMoveCommandAllOf)
	})
}