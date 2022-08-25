/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type Player struct {

	Name string `json:"name"`

	Color []int32 `json:"color"`

	NetWorth NetWorth `json:"netWorth"`
}

// AssertPlayerRequired checks if the required fields are not zero-ed
func AssertPlayerRequired(obj Player) error {
	elements := map[string]interface{}{
		"name": obj.Name,
		"color": obj.Color,
		"netWorth": obj.NetWorth,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	if err := AssertNetWorthRequired(obj.NetWorth); err != nil {
		return err
	}
	return nil
}

// AssertRecursePlayerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Player (e.g. [][]Player), otherwise ErrTypeAssertionError is thrown.
func AssertRecursePlayerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aPlayer, ok := obj.(Player)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertPlayerRequired(aPlayer)
	})
}
