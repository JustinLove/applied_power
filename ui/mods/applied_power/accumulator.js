define([], function() {
  return function(rate) {
    var ac = ko.observable(0)
    ac.time = new Date().getTime(),
    ac.rate = rate()
    var update = function() {
      var t2 = new Date().getTime()
      var dt = t2 - ac.time
      var nextValue = ac() + ac.rate * dt / 1000
      ac.rate = rate()
      ac.time = t2
      ac(nextValue)
    }
    rate.subscribe(update)
    ac.tick = function() {
      update()
      setTimeout(ac.tick, 1000)
    }
    ac.tick()
    return ac
  }
})
