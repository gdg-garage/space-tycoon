/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type Destination struct {
}

// AssertDestinationRequired checks if the required fields are not zero-ed
func AssertDestinationRequired(obj Destination) error {
	return nil
}

// AssertRecurseDestinationRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Destination (e.g. [][]Destination), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseDestinationRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aDestination, ok := obj.(Destination)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertDestinationRequired(aDestination)
	})
}