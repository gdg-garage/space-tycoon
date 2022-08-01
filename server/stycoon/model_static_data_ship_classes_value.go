/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type StaticDataShipClassesValue struct {

	Name string `json:"name,omitempty"`

	// whether ships of this class are allowed to construct new ships
	Shipyard bool `json:"shipyard,omitempty"`

	Speed float64 `json:"speed,omitempty"`

	// maximum number of resources the ship can carry - sum over all types of resources
	CargoCapacity int64 `json:"cargo-capacity,omitempty"`

	Life int64 `json:"life,omitempty"`

	Damage int64 `json:"damage,omitempty"`
}

// AssertStaticDataShipClassesValueRequired checks if the required fields are not zero-ed
func AssertStaticDataShipClassesValueRequired(obj StaticDataShipClassesValue) error {
	return nil
}

// AssertRecurseStaticDataShipClassesValueRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of StaticDataShipClassesValue (e.g. [][]StaticDataShipClassesValue), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseStaticDataShipClassesValueRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aStaticDataShipClassesValue, ok := obj.(StaticDataShipClassesValue)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertStaticDataShipClassesValueRequired(aStaticDataShipClassesValue)
	})
}