(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.applied_power = 'coui://ui/mods/applied_power'

  // make the object keys exist for Panel.ready
  var stub = function() {}
  _.defaults(handlers, {
    applied_power_state: stub,
  })
})()

require(['applied_power/live_game_econ'], function(ap) {
  "use strict";
  console.log('bootstrap')

  $(ap.ready)
})
