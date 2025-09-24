Feature: Search functionality
  Scenario: User searches for a product
    Given the user is on the homepage
    When the user searches for "laptop"
    Then search results for "laptop" should be displayed
