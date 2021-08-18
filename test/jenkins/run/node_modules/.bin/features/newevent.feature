Feature: New Events

Scenario Outline: 
    Given <event_type> <component> ::: user is on record page
    When <event_type> <component> ::: user clicks new
    Then <event_type> <component> ::: new record window appears
    When <event_type> <component> ::: <visbility> <num> > info is entered
    Then <event_type> <component> ::: event is saved
    When <event_type> <component> ::: photo is uploaded
    Then <event_type> <component> ::: <num> event is validated to be <visbility>
    
    Examples:
        |event_type|component|visbility|num|
        |Community|Upcoming|visible|0|
        |Community|Upcoming|invisible|1|
        |Parent|Upcoming|visible|2|
        |Parent|Upcoming|invisible|3|
        |Community|Previous|visible|4|
        |Community|Previous|invisible|5|
        |Parent|Previous|visible|6|
        |Parent|Previous|invisible|7|