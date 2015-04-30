(function() {
  "use strict";

  var lobbyId = ko.observable().extend({ session: 'lobbyId' });

  if (!lobbyId()) {
    engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
      data = JSON.parse(data);
      console.log(data)
      lobbyId(data.LobbyID)
    })
  }

  handlers.applied_power_hello = function() {
    console.log('hello from applied power')
    api.panels.econ.message('applied_power_state', {
      lobbyId: lobbyId(),
    });
  }
})()
