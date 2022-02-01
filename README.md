# Travelm-Agency-Webpack-Plugin

This plugin incorporates the [travelm-agency](https://github.com/andreasewering/travelm-agency) code generator into your webpack build.
It runs in watch mode whenever your translation files change as well as once in build.
Since the code generator emits Elm code that will be used in further steps, it
runs at the very start of the webpack event chain.

## Usage

Take a look at the [webpack.config.js](example/webpack.config.js) in the example folder. 
Add the plugin to the plugins section and configure it using the options object. 

