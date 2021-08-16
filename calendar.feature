Feature: Calendar

Background: login
    Given user is logged in

Scenario Outline: <event_type> <Page> ::: <calendar_type>
    Given <event_type> <Page> ::: url is opened
    Then <event_type> <Page> ::: calendar is displayed
    Then <event_type> <Page> ::: drop down shows
    When <event_type> <Page> ::: user selects <calendar_type>
    Then <event_type> <Page> ::: <calendar_type> is downloaded
    And <event_type> <Page> ::: delete <calendar_type> download
  
    Examples:
        |event_type|Page|calendar_type|
        #Community Events
        |Community|Tile|iOS/Outlook|
        |Community|Tile|Google Calendar|
        |Community|Row|Google Calendar|
        |Community|Row|iOS/Outlook|
       # Child Events
        |Child|Tile|iOS/Outlook|
        |Child|Tile|Google Calendar|
        |Child|Row|Google Calendar|
        |Child|Row|iOS/Outlook|
       #Parent Agenda
        |Agenda|Tile|iOS/Outlook|
        |Agenda|Tile|Google Calendar|
       #Parent Events
        |Parent|Tile|iOS/Outlook|
        |Parent|Tile|Google Calendar|
        |Parent|Row|Google Calendar|
        |Parent|Row|iOS/Outlook|
    #Favorites
        |Favorites|Tile|iOS/Outlook|
        |Favorites|Tile|Google Calendar|
    #Related
        |Related|Tile|iOS/Outlook|
        |Related|Tile|Google Calendar|   
    #Description
        |eventDescription|Tile|iOS/Outlook|
        |eventDescription|Tile|Google Calendar|
