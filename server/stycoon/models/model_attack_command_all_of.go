/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type AttackCommandAllOf struct {

	Target int64 `json:"target"`
}

// AssertAttackCommandAllOfRequired checks if the required fields are not zero-ed
func AssertAttackCommandAllOfRequired(obj AttackCommandAllOf) error {
	elements := map[string]interface{}{
		"target": obj.Target,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecurseAttackCommandAllOfRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of AttackCommandAllOf (e.g. [][]AttackCommandAllOf), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseAttackCommandAllOfRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aAttackCommandAllOf, ok := obj.(AttackCommandAllOf)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertAttackCommandAllOfRequired(aAttackCommandAllOf)
	})
}