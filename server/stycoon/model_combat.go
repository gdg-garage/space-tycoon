/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type Combat struct {

	Tick int64 `json:"tick,omitempty"`

	Attacker string `json:"attacker,omitempty"`

	Defender string `json:"defender,omitempty"`

	Killed bool `json:"killed,omitempty"`
}

// AssertCombatRequired checks if the required fields are not zero-ed
func AssertCombatRequired(obj Combat) error {
	return nil
}

// AssertRecurseCombatRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Combat (e.g. [][]Combat), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseCombatRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aCombat, ok := obj.(Combat)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertCombatRequired(aCombat)
	})
}
