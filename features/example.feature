Feature: Example
  As a creator of a CMACC document
  I want to understand the CMACC steps
  In order to test my contract

  As a CMACC developer
  I want to test the CMACC steps
  To ensure they work correctly

  Scenario: Example usage of CMACC steps
    # Find contract from the root of your project
    Given I compile the "features/support/example.cmacc" contract

    # Separate nested values with '.'
    Then the value of "foo.bar" is "baz"

    # Give a table when there are a lot of values
    And the following variable value pairs exist:
      | variable | value |
      | foo.bar  | baz   |
      | foo.bar  | baz   |

    # Render the document and set expectations on the content
    When I render the document
    Then I see "baz" in the document
