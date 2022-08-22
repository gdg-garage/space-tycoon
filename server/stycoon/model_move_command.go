/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type MoveCommand struct {
	Destination *Destination `json:"destination"`

	Type string `json:"type,omitempty"`
}

// AssertMoveCommandRequired checks if the required fields are not zero-ed
func AssertMoveCommandRequired(obj MoveCommand) error {
	elements := map[string]interface{}{
		"destination": obj.Destination,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	if obj.Destination != nil {
		if err := AssertDestinationRequired(*obj.Destination); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseMoveCommandRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MoveCommand (e.g. [][]MoveCommand), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMoveCommandRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMoveCommand, ok := obj.(MoveCommand)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMoveCommandRequired(aMoveCommand)
	})
}
