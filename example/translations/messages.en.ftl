-plugin-name = travelm-agency-webpack-plugin
title = What does the {-plugin-name} do?
paragraph = It makes usage of the travelm-agency code generator more convenient and built into your
  build process, so you do not have to remember running it every time you change a translation file.
  It uses devMode for watch events so you can incrementally add your translations in your languages and not
  have to worry about compile errors.
demo = You can use the full power of travelm-agency, including things like matching on plurals that are normally
  impossible in Elm: { NUMBER($number) -> 
    [one] Rolled a single six
    *[other] Rolled {$number} sixes 
  }

language = { $language ->
    [en] English
    [de] German
    *[unknown] ??? 
  }