# Amőba

`/ˈɒmøːbɒ/`

Infinite TicTacToe, Russian TicTacToe, Ultimate TicTacToe - however you may call it.

5 in a row wins.

~~Scroll for more space!~~

Space is generated on the peripherary of selected chunks, as needed.

---

There are url parameters to set game config:

`p1, p2, p3, p4` set the AI, which can be of type `fuzzy, elk, elkatt, elkdef`

`count` sets player amount, default: `2`

`win` sets length of winning line, default: `5`

`limit` enters a different gamemode with a limited amount of turns. Do not use AI `fuzzy` with `limit`.

Examples:

nallantli.github.io/amoeba/?p2=fuzzy (Play against AI)

nallantli.github.io/amoeba/?p1=fuzzy&p2=fuzzy (AIs play against each other)

nallantli.github.io/amoeba/?count=3&limit=40&p1=elkatt&p3=elkdef&win=3 (Play as player 2 against two AIs in limit mode with 40 turn limits and score starting at length 3 - recommended)

----

_Up and down I go,_

_trying hard to make a row;_

_dang - A.I just won._
