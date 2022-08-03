/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type StaticData struct {

	ShipClasses map[string]StaticDataShipClassesValue `json:"ship-classes,omitempty"`

	ResourceNames map[string]string `json:"resource-names,omitempty"`
}

// AssertStaticDataRequired checks if the required fields are not zero-ed
func AssertStaticDataRequired(obj StaticData) error {
	return nil
}

// AssertRecurseStaticDataRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of StaticData (e.g. [][]StaticData), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseStaticDataRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aStaticData, ok := obj.(StaticData)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertStaticDataRequired(aStaticData)
	})
}