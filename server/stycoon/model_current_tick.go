/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type CurrentTick struct {

	Tick int64 `json:"tick"`

	MinTimeLeftMs int64 `json:"minTimeLeftMs"`

	Season int64 `json:"season"`
}

// AssertCurrentTickRequired checks if the required fields are not zero-ed
func AssertCurrentTickRequired(obj CurrentTick) error {
	elements := map[string]interface{}{
		"tick": obj.Tick,
		"minTimeLeftMs": obj.MinTimeLeftMs,
		"season": obj.Season,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecurseCurrentTickRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of CurrentTick (e.g. [][]CurrentTick), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseCurrentTickRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aCurrentTick, ok := obj.(CurrentTick)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertCurrentTickRequired(aCurrentTick)
	})
}
