/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type ScoreValue struct {

	Money []map[string]int64 `json:"money,omitempty"`

	Resources []map[string]int64 `json:"resources,omitempty"`

	Ships []map[string]int64 `json:"ships,omitempty"`

	Total []map[string]int64 `json:"total,omitempty"`
}

// AssertScoreValueRequired checks if the required fields are not zero-ed
func AssertScoreValueRequired(obj ScoreValue) error {
	return nil
}

// AssertRecurseScoreValueRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of ScoreValue (e.g. [][]ScoreValue), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseScoreValueRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aScoreValue, ok := obj.(ScoreValue)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertScoreValueRequired(aScoreValue)
	})
}