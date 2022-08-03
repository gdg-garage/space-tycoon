/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type PlanetsValue struct {

	Name string `json:"name,omitempty"`

	Resources map[string]TradingResource `json:"resources,omitempty"`

	Position []int64 `json:"position,omitempty"`

	PrevPosition []int64 `json:"prev-position,omitempty"`
}

// AssertPlanetsValueRequired checks if the required fields are not zero-ed
func AssertPlanetsValueRequired(obj PlanetsValue) error {
	return nil
}

// AssertRecursePlanetsValueRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of PlanetsValue (e.g. [][]PlanetsValue), otherwise ErrTypeAssertionError is thrown.
func AssertRecursePlanetsValueRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aPlanetsValue, ok := obj.(PlanetsValue)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertPlanetsValueRequired(aPlanetsValue)
	})
}