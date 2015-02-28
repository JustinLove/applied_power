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

    var percent = function(x) {
      return ko.computed(function() {
        var d = transform(x())
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

    resource.spent = ko.computed(function() {
      var available = resource.currentGain() + resource.current()
      return Math.min(resource.currentLoss(), available)
    })
    resource.spentString = ko.computed(function() {
      return model.formatedRateString(resource.spent())
    })

    resource.percentLoss = percent(resource.currentLoss)
    resource.percentGain = percent(resource.currentGain)
    resource.percentSpent = percent(resource.spent)
  }
})
