Feature: Notifications

Background: login
    Given user is logged in

Scenario Outline:
    Given <notificationtype> :: events are created
    When <notificationtype> :: user opens homepage
    And <notificationtype> :: opens community event
    And <notificationtype> :: opens parent event
    When <notificationtype> :: notification fires
    Then <notificationtype> :: validate is displayed
    When <notificationtype> :: user clicks on Notification
    Then <notificationtype> :: they are taken to the event
        Examples:
        |notificationtype|
        |live|
        |recorded|
