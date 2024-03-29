/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type TradeCommand struct {

	// Positive value means buy, negative sell.
	Amount *int64 `json:"amount"`

	Resource *string `json:"resource"`

	// Any planet or own ship.
	Target *string `json:"target"`

	Type string `json:"type,omitempty"`
}

// AssertTradeCommandRequired checks if the required fields are not zero-ed
func AssertTradeCommandRequired(obj TradeCommand) error {
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

// AssertRecurseTradeCommandRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of TradeCommand (e.g. [][]TradeCommand), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseTradeCommandRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aTradeCommand, ok := obj.(TradeCommand)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertTradeCommandRequired(aTradeCommand)
	})
}
