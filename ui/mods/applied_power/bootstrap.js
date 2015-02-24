(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.applied_power = 'coui://ui/mods/applied_power'
})()

require(['applied_power/live_game_econ'], function(ap) {
  "use strict";
  console.log('bootstrap')

  $(ap.ready)
})
