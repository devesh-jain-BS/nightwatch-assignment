Feature: Validate UltimateQA Automation Page

Scenario: Validate the page title
  Given I navigate to "https://ultimateqa.com/automation"
  Then the page title should be "Automation Practice - Ultimate QA"

Scenario: Validate all links are working
  Given I navigate to "https://ultimateqa.com/automation"
  Then all links should work and redirect properly

Scenario: Fetch JavaScript/console errors
  Given I navigate to "https://ultimateqa.com/automation"
  Then I should see no JavaScript errors in the console