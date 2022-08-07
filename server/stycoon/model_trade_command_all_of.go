/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type TradeCommandAllOf struct {

	Amount int64 `json:"amount"`

	Resource int64 `json:"resource"`

	Target int64 `json:"target"`
}

// AssertTradeCommandAllOfRequired checks if the required fields are not zero-ed
func AssertTradeCommandAllOfRequired(obj TradeCommandAllOf) error {
	elements := map[string]interface{}{
		"amount": obj.Amount,
		"resource": obj.Resource,
		"target": obj.Target,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecurseTradeCommandAllOfRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of TradeCommandAllOf (e.g. [][]TradeCommandAllOf), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseTradeCommandAllOfRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aTradeCommandAllOf, ok := obj.(TradeCommandAllOf)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertTradeCommandAllOfRequired(aTradeCommandAllOf)
	})
}
