define([], function() {
  var serializeAccumulator = function(accum) {
    return {
      time: accum.time,
      rate: accum.rate,
      value: accum(),
    }
  }

  var deserializeAccumulator = function(accum, data) {
    accum.time = data.time
    accum.rate = data.rate
    accum(data.value)
    accum.tick
  }

  var enableStorage = function(lobbyId, metalSpent) {
    var storage = ko.observable().extend({ local: 'applied_power' })

    if (storage()) {
      var ser = JSON.parse(storage())
      if (ser.lobbyId == lobbyId && ser.metalSpent) {
        deserializeAccumulator(metalSpent, ser.metalSpent)
      }
    }

    var storageObject = ko.computed(function() {
      return {
        lobbyId: lobbyId,
        metalSpent: serializeAccumulator(metalSpent)
      }
    })

    storageObject.subscribe(function(ser) {
      console.log(ser)
      storage(JSON.stringify(ser))
    })
  }

  return {
    enableStorage: enableStorage
  }
})
