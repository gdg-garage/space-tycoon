/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type DecommissionCommand struct {
	Type string `json:"type,omitempty"`
}

// AssertDecommissionCommandRequired checks if the required fields are not zero-ed
func AssertDecommissionCommandRequired(obj DecommissionCommand) error {
	return nil
}

// AssertRecurseDecommissionCommandRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of DecommissionCommand (e.g. [][]DecommissionCommand), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseDecommissionCommandRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aDecommissionCommand, ok := obj.(DecommissionCommand)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertDecommissionCommandRequired(aDecommissionCommand)
	})
}
