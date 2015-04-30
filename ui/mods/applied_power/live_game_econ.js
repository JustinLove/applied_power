define([
  'applied_power/resource',
  'applied_power/judgement',
  'applied_power/accumulator',
  'applied_power/persist',
], function(
  extendResource,
  judgement,
  accumulator,
  persist
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

  model.energyPerMetal = ko.computed(function() {
    if (metal.spending() == 0) {
      return model.formatedRateString(energy.currentLoss())
    } else {
      return model.formatedRateString(energy.currentLoss() / metal.spending())
    }
  })

  model.energyPerMetalSupply = ko.computed(function() {
    if (metal.currentGain() == 0) {
      return model.formatedRateString(energy.currentGain())
    } else {
      return model.formatedRateString(energy.currentGain() / metal.currentGain())
    }
  })

  model.energyPerMetalDemand = ko.computed(function() {
    if (metal.unlimitedLoss() == 0) {
      return model.formatedRateString(energy.currentLoss())
    } else {
      return model.formatedRateString(energy.currentLoss() / metal.unlimitedLoss())
    }
  })

  var epmScale = ko.computed(function() {
    return Math.max(
      model.energyPerMetalSupply(),
      model.energyPerMetalDemand(),
      model.energyPerMetal())
  })

  var epmPercent = function(x) {
    return ko.computed(function() {
      var d = x() / epmScale()
      if (d < 0) {return 0}
      return '' + (100 * d) + '%'
    })
  }

  model.percentEPMSupply = epmPercent(model.energyPerMetalSupply)
  model.percentEPMDemand = epmPercent(model.energyPerMetalDemand)
  model.percentEPM = epmPercent(model.energyPerMetal)

  model.limit = ko.computed(function() {
    if (metal.currentLoss() > metal.currentGain()) {
      if (metal.ratio() < 0.75) {
        return 'reduce-build-power'
      } else {
        return 'increase-metal-supply'
      }
    } else if (energy.ratio() < 1) {
      if (energy.ratio() < 0.75) {
        return 'reduce-energy-demand'
      } else if (model.energyPerMetalDemand() < model.energyPerMetalSupply()) {
        return 'reduce-energy-demand'
      } else {
        return 'increase-energy-supply'
      }
    } else {
      return 'increase-build-power'
    }
  })

  model.economyEfficiencyPercColoration = ko.computed(function() {
    return 'rate-' + judgement.efficiency(model.economyEfficiencyPerc()/100.0)
  })

  model.radarEfficiencyRatio = ko.computed(function() {
    if (energy.current() > 0) {
      return 1.0
    } else if (energy.ratio() > 0.9) {
      return (energy.ratio() - 0.9) * 10
    } else {
      return 0
    }
  })

  model.radarEfficiencyPercString = ko.computed(function () {
    var ePerc = Number(model.radarEfficiencyRatio() * 100).toFixed(0);
    if (ePerc > 999) {
      return '--';
    } else {
      return '' + ePerc + '%';
    }
  });

  model.radarEfficiencyPercColoration = ko.computed(function() {
    return 'rate-' + judgement.efficiency(model.radarEfficiencyRatio())
  })

  model.metalSpent = accumulator(metal.spending)
  model.metalSpentString = ko.computed(function() {
    return model.formatedRateString(model.metalSpent())
  })

  handlers.applied_power_state = function(payload) {
    console.log(payload)
    if (payload.lobbyId) {
      persist.enableStorage(payload.lobbyId, model.metalSpent)
    }
  }

  return {
    ready: function() {
      console.log('ready')
      api.Panel.message(api.Panel.parentId, 'applied_power_hello');
      ko.applyBindings(model)
    },
    metal: metal,
    energy: energy
  }
})
