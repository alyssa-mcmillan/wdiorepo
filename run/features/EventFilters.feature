Feature: Event Filters

Background: Given user is logged in
    Given user is logged in


Scenario Outline: check event filter functionality
    Given <event_type> <component> <filter_type> :: user is on page
    When <event_type> <component> <filter_type> :: user selects filter
    Then <event_type> <component> <filter_type> :: component only displays correct results
    Examples:
        |event_type|component|filter_type|
        |Community|Upcoming|eventtype|
        |Community|Upcoming|host|
        |Community|Previous|eventtype|
        |Community|Previous|host|
        |Child|Upcoming|eventtype|
        |Child|Upcoming|host|
        |Child|Previous|eventtype|
        |Child|Previous|host|

        
