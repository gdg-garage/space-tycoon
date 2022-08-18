/*
 * Space Tycoon
 *
 * Space Tycoon server.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package stycoon

type Reports struct {

	Combat []Combat `json:"combat,omitempty"`

	Trade []Trade `json:"trade,omitempty"`

	// Profiling information about the game. Used by the visualization website.
	Profiling []Profiling `json:"profiling,omitempty"`

	// Prices are average across all planets.
	Prices map[string]map[string]int64 `json:"prices,omitempty"`

	ResourceAmounts map[string]map[string]int64 `json:"resourceAmounts,omitempty"`

	Scores map[string]ScoreValue `json:"scores,omitempty"`

	Season int64 `json:"season,omitempty"`

	Tick int64 `json:"tick,omitempty"`
}

// AssertReportsRequired checks if the required fields are not zero-ed
func AssertReportsRequired(obj Reports) error {
	for _, el := range obj.Combat {
		if err := AssertCombatRequired(el); err != nil {
			return err
		}
	}
	for _, el := range obj.Trade {
		if err := AssertTradeRequired(el); err != nil {
			return err
		}
	}
	for _, el := range obj.Profiling {
		if err := AssertProfilingRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseReportsRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Reports (e.g. [][]Reports), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseReportsRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aReports, ok := obj.(Reports)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertReportsRequired(aReports)
	})
}
