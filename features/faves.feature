Feature: favorite an event

Scenario Outline: <component> <Page> <event_type> <type> <> 
    Given <component> <Page> <event_type> ::: url is opened 
    When <component> <Page> <event_type> ::: user <type>
    
    Examples:
        |type|component|event_type|Page|                                        
        |favorites|Upcoming|Community|Tile|
        |unfavorites|Upcoming|Community|Tile|
        |favorites|Previous|Community|Tile|
        |unfavorites|Previous|Community|Tile|
        |favorites|Upcoming|Community|Row|
        |unfavorites|Upcoming|Community|Row|
        |favorites|Previous|Community|Row|
        |unfavorites|Previous|Community|Row|
        |favorites|Upcoming|Parent|Tile|
        |unfavorites|Upcoming|Parent|Tile|
        |favorites|Previous|Parent|Tile|
        |unfavorites|Previous|Parent|Tile|
        |favorites|Upcoming|Parent|Row|
        |unfavorites|Upcoming|Parent|Row|
        |favorites|Previous|Parent|Row|
        |unfavorites|Previous|Parent|Row|
        |favorites|Upcoming|Child|Tile|
        |unfavorites|Upcoming|Child|Tile|
        |favorites|Previous|Child|Tile|
        |unfavorites|Previous|Child|Tile|
        |favorites|Upcoming|Child|Row|
        |unfavorites|Upcoming|Child|Row|
        |favorites|Previous|Child|Row|
        |unfavorites|Previous|Child|Row|
        |favorites|Upcoming|Agenda|Tile|
        |unfavorites|Upcoming|Agenda|Tile|
        |favorites|Upcoming|eventDescription|Tile|
        |unfavorites|Upcoming|eventDescription|Tile|
        |favorites|Upcoming|Related|Tile|
        |unfavorites|Upcoming|Related|Tile|

