Feature: Example
  As a creator of a CMACC document
  I want to understand the CMACC steps
  In order to test my contract

  As a CMACC developer
  I want to test the CMACC steps
  To ensure they work correctly

  # Usage of 'document' can be changed to 'contract' or 'file' or even omitted
  # in some cases
  Scenario: Example usage of CMACC steps
    # Find the document from the root of your project
    Given I compile the "features/support/example.cmacc" document

    # Separate nested values with '.'
    Then the value of "foo.bar" is "baz"

    # Give a table when there are a lot of values
    And it contains the following variables and values:
      | foo.bar  | baz   |
      | foo.qux  | quux  |

    # Render the document and set expectations on the content
    When I render the document
    Then I see "baz" in the document
    And I don't see "quux"

    # Change values of variables and render again to see the change
    When I change "foo.bar" to "henk"
    And I render the document
    Then I don't see "baz" in the document
    But I do see "henk"
