define([
  'applied_power/resource',
  'applied_power/judgement',
], function(
  extendResource,
  judgement
) {
  "use strict";

  var metal = {
    resource: 'metal',
    current: model.currentMetal,
    currentString: model.currentMetalString,
    max: model.maxMetal,
    currentGain: model.metalGain,
    currentGainString: model.metalGainString,
    currentLoss: model.metalLoss,
    currentLossString: model.metalLossString,
    net: model.metalNet,
    netStringStock: model.metalNetString,
    netStringBfs: ko.computed(function() {
      return ((model.metalNet() > 0) ? '+' : '') + Math.round(model.metalNet()/10)
    }),
    efficiencyString: model.metalEfficiencyPercString,
    fractionString: ko.computed(function () {
      return '' + (100 * model.metalFraction()).toFixed(0) + '%';
    }),
    shared: model.metalShared,
    min: 20,
    tick: 10,
    judgement: judgement.metal,
  }

  var energy = {
    resource: 'energy',
    current: model.currentEnergy,
    currentString: model.currentEnergyString,
    max: model.maxEnergy,
    currentGain: model.energyGain,
    currentGainString: model.energyGainString,
    currentLoss: model.energyLoss,
    currentLossString: model.energyLossString,
    net: model.energyNet,
    netStringStock: model.energyNetString,
    netStringBfs: ko.computed(function() {
      return ((model.energyNet() > 0) ? '+' : '') + Math.round(model.energyNet()/800)
    }),
    efficiencyString: model.energyEfficiencyPercString,
    fractionString: ko.computed(function () {
      return '' + (100 * model.energyFraction()).toFixed(0) + '%';
    }),
    shared: model.energyShared,
    min: 2000,
    tick: 1000,
    judgement: judgement.energy,
  }

  extendResource(metal)
  extendResource(energy)

  var limit = metal.limit = energy.limit = ko.computed(function() {
    if (metal.ratio() < 1) {
      return 'metal'
    } else if (energy.ratio() < 1) {
      return 'energy'
    } else {
      return 'none'
    }
  })

  model.metal = metal
  model.energy = energy

  model.buildPower = ko.computed(function() {
    if (energy.ratio() != 0) {
      return metal.currentLoss() / energy.ratio()
    } else {
      return metal.currentLoss()
    }
  })

  model.buildPowerString = ko.computed(function() {
    return model.formatedRateString(model.buildPower())
  })

  model.buildPowerPercent = ko.computed(function() {
    var d = metal.transform(model.buildPower())
    if (d < 0) {return 0}
    return '' + (100 * d) + '%'
  })

  model.appliedPower = ko.computed(function() {
    if (metal.current() > 1) {
      return metal.currentLoss()
    } else {
      return Math.min(metal.currentLoss(), metal.currentGain())
    }
  })

  model.appliedPowerString = ko.computed(function() {
    return model.formatedRateString(model.appliedPower())
  })

  return {
    ready: function() {
      console.log('ready')
      ko.applyBindings(model)
    },
    metal: metal,
    energy: energy
  }
})
