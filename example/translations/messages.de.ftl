-plugin-name = travelm-agency-webpack-plugin
title = Was macht das {-plugin-name}?
paragraph = Mit dem Plugin wird die Verwendung des travelm-agency Codegenerators vereinfacht und in deinen Buildprozess
  eingebaut, so dass du nicht mehr daran denken musst ihn bei jeder Änderung einer Übersetzungsdatei laufen zu lassen.
  Im Webpack Watch Mode nutzt das Plugin den devMode, sodass du inkrementell Anpassungen an Übersetzungen ohne Compile-Fehler machen kannst.
demo = Du kannst die volle Funktionalität von travelm-agency benutzen, inklusive Features wie Plural-Matching, was sonst
  unmöglich in Elm ist: { NUMBER($number) -> 
    [one] Es wurde eine Sechs gerollt
    *[other] Es wurden {$number} Sechsen gerollt 
  }

language = { $language ->
    [en] Englisch
    [de] Deutsch
    *[unknown] ??? 
  }