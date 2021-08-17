Feature: register for event

Scenario Outline: 
    Given <component> <Page> <event_type> ::: url is opened
    When <component> <Page> <event_type> ::: user <type> for event

    Examples:
        |type|component|Page|event_type|
        |registers|Upcoming|Tile|Community|
        |unregisters|Upcoming|Tile|Community|
        |registers|Upcoming|Row|Community|
        |unregisters|Upcoming|Row|Community|
        |registers|Previous|Tile|Community|
        |unregisters|Previous|Tile|Community|
        |registers|Previous|Row|Community|
        |unregisters|Previous|Row|Community|
        |registers|Upcoming|Tile|Parent|
        |unregisters|Upcoming|Tile|Parent|
        |registers|Upcoming|Row|Parent|
        |unregisters|Upcoming|Row|Parent|
        |registers|Previous|Tile|Parent|
        |unregisters|Previous|Tile|Parent|
        |registers|Previous|Row|Parent|
        |unregisters|Previous|Row|Parent|
        |registers|Upcoming|Tile|Carousel|
        |registers|Upcoming|Tile|Child|
        |unregisters|Upcoming|Tile|Child|
        |registers|Upcoming|Row|Child|
        |unregisters|Upcoming|Row|Child|
        |registers|Previous|Tile|Child|
        |unregisters|Previous|Tile|Child|
        |registers|Previous|Row|Child|
        |unregisters|Previous|Row|Child|
        |unregisters|Upcoming|Tile|Carousel|
        |registers|Upcoming|Row|Description|
        |unregisters|Upcoming|Row|Description|
        |registers|Upcoming|Row|PlayerWrapper|
        |unregisters|Upcoming|Row|PlayerWrapper|
        |registers|Upcoming|Row|Related|
        |unregisters|Upcoming|Row|Related|
