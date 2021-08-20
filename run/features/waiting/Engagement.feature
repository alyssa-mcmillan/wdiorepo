Feature: Engagement Stats

Scenario Outline: 
    Given <playertype> :: user is on event page
    When <playertype> :: user presses play
    When <playertype> :: user presses pause
    Then <playertype> :: checks initial event statistic
    When <playertype> :: user plays video again
    Then <playertype> :: checks updated event statistic
    When <playertype> :: user completes video
    Then <playertype> :: checks completed event statistic
    When <playertype> :: user restarts video
    Then <playertype> :: number of plays increases
    Examples:
    |playertype|
    # |YouTube|
    # |Vimeo|
    # |mp3|