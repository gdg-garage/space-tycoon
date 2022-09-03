/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type Planet struct {

	Name string `json:"name"`

	Resources map[string]TradingResource `json:"resources"`

	Position *[]int64 `json:"position"`

	PrevPosition *[]int64 `json:"prevPosition"`
}

// AssertPlanetRequired checks if the required fields are not zero-ed
func AssertPlanetRequired(obj Planet) error {
	elements := map[string]interface{}{
		"name": obj.Name,
		"resources": obj.Resources,
		"position": obj.Position,
		"prevPosition": obj.PrevPosition,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecursePlanetRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Planet (e.g. [][]Planet), otherwise ErrTypeAssertionError is thrown.
func AssertRecursePlanetRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aPlanet, ok := obj.(Planet)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertPlanetRequired(aPlanet)
	})
}
