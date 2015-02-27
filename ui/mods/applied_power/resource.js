define(['applied_power/series'], function(series) {
  var tickColor = function(weight) {
    return 'rgba(255, 255, 255, ' + weight + ')'
  }

  return function(resource) {
    resource.scale = ko.computed(function() {
      if (resource.loss) {
        return Math.max(resource.min, resource.currentGain() * 2, resource.currentLoss(),
          resource.gain.max() * 2, resource.loss.max())
      } else {
        return Math.max(resource.min, resource.currentGain() * 2, resource.currentLoss())
      }
    })

    var linearTransform = function(x) {
      return x / resource.scale()
    }

    // likely overwritten
    var logScale = 1000
    var transform = linearTransform 
    resource.transform = transform

    var percent = function(left, right) {
      return ko.computed(function() {
        var d = transform(right()) - transform(left())
        if (d < 0) {return 0}
        return '' + (100 * d) + '%'
      })
    }

    resource.gain = series(resource.currentGain)
    resource.loss = series(resource.currentLoss)
    resource.ratio = ko.computed(function() {
      if (resource.current() > 1) {
        return 1
      }
      var denom = resource.currentLoss()
      if (denom < 1) {denom = 1}
      return resource.currentGain() / denom
    })
    resource.efficiency = ko.computed(function() {
      return '' + Math.round(100 * resource.ratio()) + '%'
    })
    resource.colorCalculated = ko.computed(function() {
      var storage = resource.current() / resource.max()
      var denom = resource.currentLoss()
      if (denom < 1) {denom = 1}
      var ratio = resource.currentGain() / denom
      return 'rate-' + resource.judgement(storage, ratio)
    })

    resource.coloration = ko.observable()

    resource.colorCalculated.subscribe(resource.coloration)

    resource.coloration.subscribe(function(value) {
      if (resource.$parent) {
        resource.$parent.attr('class', 'contents ' + value)
      }
    })

    var zero = function() {return 0}
    var unit_loss = resource.currentLoss
    var unit_toStorage = ko.computed(function() {
      var net = Math.max(0, resource.currentGain() - resource.currentLoss() + resource.shared())
      return Math.min(net, resource.max() - resource.current())
    })
    var unit_toSharing = ko.computed(function() {
      return Math.max(0, -resource.shared())
    })
    var unit_gain = resource.currentGain
    var unit_fromSharing = ko.computed(function() {
      return Math.max(0, resource.shared())
    })
    var unit_fromStorage = ko.computed(function() {
      var net = Math.max(0, resource.currentLoss() - resource.currentGain() - resource.shared())
      return Math.min(net, resource.current())
    })
    var unit_spent = ko.computed(function() {
      var available = resource.currentGain() + resource.current()
      return Math.min(resource.currentLoss(), available)
    })

    var unit_rightToStorage = ko.computed(function() {
      return unit_loss() + unit_toStorage()
    })
    var unit_rightToSharing = ko.computed(function() {
      return unit_loss() + unit_toStorage() + unit_toSharing()
    })
    var unit_rightFromSharing = ko.computed(function() {
      return unit_gain() + unit_fromSharing()
    })
    var unit_rightFromStorage = ko.computed(function() {
      return unit_gain() + unit_fromSharing() + unit_fromStorage()
    })

    resource.percentLoss = percent(zero, unit_loss)
    resource.percentGain = percent(zero, unit_gain)
    resource.percentSpent = percent(zero, unit_spent)

    resource.bars = [
      {
        name: 'bar-range',
        tooltip: '30s range',
        left: percent(zero, resource.loss.rangeStart),
        width: percent(resource.loss.rangeStart, resource.loss.rangeEnd)
      },
      {
        name: 'bar-loss',
        tooltip: resource.resource + ' expended',
        left: zero,
        width: percent(zero, unit_loss)
      },
      {
        name: 'bar-to-storage',
        tooltip: resource.resource + ' to storage',
        left: percent(zero, unit_loss),
        width: percent(unit_loss, unit_rightToStorage)
      },
      {
        name: 'bar-to-sharing',
        tooltip: resource.resource + ' to allies',
        left: percent(zero, unit_rightToStorage),
        width: percent(unit_rightToStorage, unit_rightToSharing)
      },
      {
        name: 'bar-gain',
        tooltip: resource.resource + ' produced',
        left: zero,
        width: percent(zero, unit_gain)
      },
      {
        name: 'bar-from-sharing',
        tooltip: resource.resource + ' from allies',
        left: percent(zero, unit_gain),
        width: percent(unit_gain, unit_rightFromSharing)
      },
      {
        name: 'bar-from-storage',
        tooltip: resource.resource + ' from storage',
        left: percent(zero, unit_rightFromSharing),
        width: percent(unit_rightFromSharing, unit_rightFromStorage)
      }
    ]
  }
})
