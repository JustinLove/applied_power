define([
  'applied_power/resource',
  'applied_power/judgement',
], function(
  extendResource,
  judgement
) {
  "use strict";

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
    efficiencyString: model.energyEfficiencyPercString,
    fractionString: ko.computed(function () {
      return '' + (100 * model.energyFraction()).toFixed(0) + '%';
    }),
    shared: model.energyShared,
    limitingFactor: ko.observable(1),
    min: 2000,
    judgement: judgement.energy,
  }

  extendResource(energy)

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
    efficiencyString: model.metalEfficiencyPercString,
    fractionString: ko.computed(function () {
      return '' + (100 * model.metalFraction()).toFixed(0) + '%';
    }),
    shared: model.metalShared,
    limitingFactor: energy.ratio,
    min: 20,
    judgement: judgement.metal,
  }

  extendResource(metal)

  model.metal = metal
  model.energy = energy

  return {
    ready: function() {
      console.log('ready')
      ko.applyBindings(model)
    },
    metal: metal,
    energy: energy
  }
})
