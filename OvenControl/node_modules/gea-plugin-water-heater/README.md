# Water Heater
**General Electric Appliances Water Heater Software Development Kit**

This node.js package provides functionality for communicating with a water heater via the [General Electric Appliance Software Development Kit](https://github.com/GEMakers/gea-sdk). In order to use this software, you must first connect your water heater to your computer using the [Green Bean](https://github.com/GEMakers/green-bean).

&#x26a0; DANGER: To prevent a risk of personal injury or property damage use this device and the API to modify the functionality of your GE Appliance only as directed in the [Guide to Safe and Reliable Operation](#guide-to-safe-and-reliable-operation). While an appliance operates in Consumer Mode, the control software applies algorithms that help protect consumers from a risk of personal injury or property damage. However, in Native Mode, these algorithms are not active. Therefore you must follow all guidelines for Safe/Reliable Operation detailed below to prevent a risk of personal injury or property damage that can arise during Native Mode Operation.


## Guide to Safe and Reliable Operation
The interface between the green bean and the hybrid electric water heater can take place while the appliance is in either a consumer or a native mode.


**Consumer mode** allows developers to access the high-level algorithms of an appliance, such as changing the operational mode or set temperature of the unit.
In consumer mode a user is unable change the low level functions that govern how the heating cycle runs.


**Native mode** allows a developer to create the low-level algorithms of an appliance, such as direct control of motors, fans, actuators, heaters, and other controlled devices.
While in native mode, high-level algorithms, such as a hybrid electric mode, are not operational.
Native mode allows a developer to, for example, create a new water heating profile to meet unique needs.
While operating in native mode, the developer must adhere to the following rules:

1. The user set point of the water heater is normally limited to 140 degrees Fahrenheit. During native mode the user should not attempt to heat the water higher than 165 degrees Fahrenheit as there is a mechanical Thermal Cut Out (TCO) that operates at approximately that temperature. TCO requires a manual reset if limits are exceeded.
1. Whenever a heating element is to be operated (elements are: Compressor, Upper Electric Element, and Lower Electric Element) the Double Line Break (DLB) relay should be closed/turned on. In order to maintain reliability of the DLB relay it is always closed while no heating elements are on, and opened only after all heating elements are off. Control of the DLB is enforced during native mode when attempting to turn on heating elements, however, it may be overridden if you command the DLB directly.
1. Due to daisy chain wiring, one and only one heating element will be energized at any one time. When the first element is energized it deprives energy from the remaining elements. The priority within the daisy chain is Upper Electric Element, Lower Electric Element, and the Compressor.
1. Excessive relay cycling can shorten the life of the relays.
1. To maintain native mode operation, the native mode command must be sent at least once every 5 minutes (2.5 minute periodic rate is recommended).


## Overview

1. [Using the Software](#using-the-software)
    - [waterHeater.userSelectedMode](#waterheateruserselectedmode)
    - [waterHeater.operatingMode](#waterheateroperatingmode)
    - [waterHeater.drmFallbackMode](#waterheaterdrmfallbackmode)
    - [waterHeater.vacationFallbackMode](#waterheatervacationfallbackmode)
    - [waterHeater.userSetpoint](#waterheaterusersetpoint)
    - [waterHeater.vacationSetpoint](#waterheatervacationsetpoint)
    - [waterHeater.actualSetpoint](#waterheateractualsetpoint)
    - [waterHeater.vacationFallbackSetpoint](#waterheatervacationfallbacksetpoint)
    - [waterHeater.timedModeHoursRemaining](#waterheatertimedmodehoursremaining)
    - [waterHeater.availableModes](#waterheateravailablemodes)
    - [waterHeater.tankSize](#waterheatertanksize)
    - [waterHeater.modelDesignator](#waterheatermodeldesignator)
    - [waterHeater.compressorRuntime](#waterheatercompressorruntime)
    - [waterHeater.dirtyFilterPercentage](#waterheaterdirtyfilterpercentage)
    - [waterHeater.faultCounters](#waterheaterfaultcounters)
    - [waterHeater.activeFaultCodes](#waterheateractivefaultcodes)
    - [waterHeater.allowedNormalSetpoints](#waterheaterallowednormalsetpoints)
    - [waterHeater.allowedVacationSetpoints](#waterheaterallowedvacationsetpoints)
    - [waterHeater.maximumAllowedVacationHours](#waterheatermaximumallowedvacationhours)
    - [waterHeater.maximumAllowedStandardElectricHours](#waterheatermaximumallowedstandardelectrichours)
    - [waterHeater.modelFeatures](#waterheatermodelfeatures)
    - [waterHeater.tankTemperature](#waterheatertanktemperature)
    - [waterHeater.evaporatorInletTemperature](#waterheaterevaporatorinlettemperature)
    - [waterHeater.evaporatorOutletTemperature](#waterheaterevaporatoroutlettemperature)
    - [waterHeater.compressorOutputTemperature](#waterheatercompressoroutputtemperature)
    - [waterHeater.ambientTemperature](#waterheaterambienttemperature)
    - [waterHeater.dlbCurrent](#waterheaterdlbcurrent)
    - [waterHeater.lineVoltage](#waterheaterlinevoltage)
    - [waterHeater.stepperMotorPosition](#waterheatersteppermotorposition)
    - [waterHeater.relayStates](#waterheaterrelaystates)
    - [waterHeater.flowEvents](#waterheaterflowevents)
    - [waterHeater.resolvedElement](#waterheaterresolvedelement)
    - [waterHeater.compressorMinimumOnOffTimeState](#waterheatercompressorminimumonofftimestate)
    - [waterHeater.sealedSystemRunState](#waterheatersealedsystemrunstate)
    - [waterHeater.currentKeysPressed](#waterheatercurrentkeyspressed)
    - [waterHeater.mixingValveTemperature](#waterheatermixingvalvetemperature)
1. [Appendix](#appendix)
    - [Unit Mode](#unit-mode)
    - [Available Modes](#available-modes)
    - [Model Features](#model-features)
    - [Relay States](#relay-states)
    - [Flow Events](#flow-events)
    - [Resolved Element](#resolved-element)
    - [On-Off Time State](#on-off-time-state)
    - [Sealed System Run State](#sealed-system-run-state)
    - [Keys Pressed](#keys-pressed)

### Using the Software
Below are a few node.js applications that demonstrate how to use this package to interact with a water heater.

### *waterHeater.userSelectedMode*
The user selected mode is an integer value of the [unit mode](#unit-mode) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.userSelectedMode.read(function(value) {
        console.log("user selected mode is:", value);
    });

    waterHeater.userSelectedMode.subscribe(function(value) {
        console.log("user selected mode changed:", value);
    });

    waterHeater.userSelectedMode.write(1);
});
```

### *waterHeater.operatingMode*
The operating mode is a read-only integer value of the [unit mode](#unit-mode) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.operatingMode.read(function(value) {
        console.log("operating mode is:", value);
    });

    waterHeater.operatingMode.subscribe(function(value) {
        console.log("operating mode changed:", value);
    });
});
```

### *waterHeater.drmFallbackMode*
The DRM fallback mode is a read-only integer value of the [unit mode](#unit-mode) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.drmFallbackMode.read(function(value) {
        console.log("drm fallback mode is:", value);
    });

    waterHeater.drmFallbackMode.subscribe(function(value) {
        console.log("drm fallback mode changed:", value);
    });
});
```

### *waterHeater.vacationFallbackMode*
The vacation fallback mode is a read-only integer value of the [unit mode](#unit-mode) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.vacationFallbackMode.read(function(value) {
        console.log("vacation fallback mode is:", value);
    });

    waterHeater.vacationFallbackMode.subscribe(function(value) {
        console.log("vacation fallback mode changed:", value);
    });
});
```

### *waterHeater.userSetpoint*
The user setpoint is an integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.userSetpoint.read(function(value) {
        console.log("user setpoint is:", value);
    });

    waterHeater.userSetpoint.subscribe(function(value) {
        console.log("user setpoint changed:", value);
    });

    waterHeater.userSetpoint.write(100);
});
```

### *waterHeater.vacationSetpoint*
The vacation setpoint is an integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.vacationSetpoint.read(function(value) {
        console.log("vacation setpoint is:", value);
    });

    waterHeater.vacationSetpoint.subscribe(function(value) {
        console.log("vacation setpoint changed:", value);
    });

    waterHeater.vacationSetpoint.write(50);
});
```

### *waterHeater.actualSetpoint*
The actual setpoint is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.actualSetpoint.read(function(value) {
        console.log("actual setpoint is:", value);
    });

    waterHeater.actualSetpoint.subscribe(function(value) {
        console.log("actual setpoint changed:", value);
    });
});
```

### *waterHeater.vacationFallbackSetpoint*
The vacation fallback setpoint is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.vacationFallbackSetpoint.read(function(value) {
        console.log("vacation fallback setpoint is:", value);
    });

    waterHeater.vacationFallbackSetpoint.subscribe(function(value) {
        console.log("vacation fallback setpoint changed:", value);
    });
});
```

### *waterHeater.timedModeHoursRemaining*
The timed mode hours remaining is an integer value.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.timedModeHoursRemaining.read(function(value) {
        console.log("timed mode hours remaining are:", value);
    });

    waterHeater.timedModeHoursRemaining.subscribe(function(value) {
        console.log("timed mode hours remaining changed:", value);
    });

    waterHeater.timedModeHoursRemaining.write(24);
});
```

### *waterHeater.availableModes*
The available modes is an integer value of the [available modes](#available-modes) bit field.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.availableModes.read(function(value) {
        console.log("available modes are:", value);
    });

    waterHeater.availableModes.subscribe(function(value) {
        console.log("available modes changed:", value);
    });
});
```

### *waterHeater.tankSize*
The tank size is a read-only integer value with units in gallons.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.tankSize.read(function(value) {
        console.log("tank size is:", value);
    });

    waterHeater.tankSize.subscribe(function(value) {
        console.log("tank size changed:", value);
    });
});
```

### *waterHeater.modelDesignator*
The model designator is a read-only ascii string.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.modelDesignator.read(function(value) {
        console.log("model designator is:", value);
    });

    waterHeater.modelDesignator.subscribe(function(value) {
        console.log("model designator changed:", value);
    });
});
```

### *waterHeater.compressorRuntime*
The compressor runtime is a read-only integer value with units in hours.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.compressorRuntime.read(function(value) {
        console.log("compressor runtime is:", value);
    });

    waterHeater.compressorRuntime.subscribe(function(value) {
        console.log("compressor runtime changed:", value);
    });
});
```

### *waterHeater.dirtyFilterPercentage*
The dirty filter percentage is a read-only integer value.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.dirtyFilterPercentage.read(function(value) {
        console.log("dirty filter percentage is:", value);
    });

    waterHeater.dirtyFilterPercentage.subscribe(function(value) {
        console.log("dirty filter percentage changed:", value);
    });
});
```

### *waterHeater.faultCounters*
The fault counters is a read-only array of integer values.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.faultCounters.read(function(value) {
        console.log("fault counters are:", value);
    });

    waterHeater.faultCounters.subscribe(function(value) {
        console.log("fault counters changed:", value);
    });
});
```

### *waterHeater.activeFaultCodes*
The active fault codes is a read-only array of integer values.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.activeFaultCodes.read(function(value) {
        console.log("active fault codes are:", value);
    });

    waterHeater.activeFaultCodes.subscribe(function(value) {
        console.log("active fault codes changed:", value);
    });
});
```

### *waterHeater.allowedNormalSetpoints*
The allowed normal setpoints is a read-only object with the following fields:
- minimumAllowedNormalSetpoint (the minimum allowed setpoint in normal mode with units in degrees Fahrenheit)
- maximumAllowedNormalSetpoint (the maximum allowed setpoint in normal mode with units in degrees Fahrenheit)

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.allowedNormalSetpoints.read(function(value) {
        console.log("allowed normal setpoints are:", value);
    });

    waterHeater.allowedNormalSetpoints.subscribe(function(value) {
        console.log("allowed normal setpoints changed:", value);
    });
});
```

### *waterHeater.allowedVacationSetpoints*
The allowed vacation setpoints is a read-only object with the following fields:
- minimumAllowedVacationSetpoint (the minimum allowed setpoint in vacation mode with units in degrees Fahrenheit)
- maximumAllowedVacationSetpoint (the maximum allowed setpoint in vacation mode with units in degrees Fahrenheit)

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.allowedVacationSetpoints.read(function(value) {
        console.log("allowed vacation setpoints are:", value);
    });

    waterHeater.allowedVacationSetpoints.subscribe(function(value) {
        console.log("allowed vacation setpoints changed:", value);
    });
});
```

### *waterHeater.maximumAllowedVacationHours*
The maximum allowed vacation hours is a read-only integer value.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.maximumAllowedVacationHours.read(function(value) {
        console.log("maximum allowed vacation hours are:", value);
    });

    waterHeater.maximumAllowedVacationHours.subscribe(function(value) {
        console.log("maximum allowed vacation hours changed:", value);
    });
});
```

### *waterHeater.maximumAllowedStandardElectricHours*
The maximum allowed standard electric hours is a read-only integer value.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.maximumAllowedStandardElectricHours.read(function(value) {
        console.log("maximum allowed standard electric hours are:", value);
    });

    waterHeater.maximumAllowedStandardElectricHours.subscribe(function(value) {
        console.log("maximum allowed standard electric hours changed:", value);
    });
});
```

### *waterHeater.modelFeatures*
The model features are a read-only integer value of the [model features](#model-features) bit field.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.modelFeatures.read(function(value) {
        console.log("model features are:", value);
    });

    waterHeater.modelFeatures.subscribe(function(value) {
        console.log("model features changed:", value);
    });
});
```

### *waterHeater.tankTemperature*
The tank temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.tankTemperature.read(function(value) {
        console.log("tank temperature is:", value);
    });

    waterHeater.tankTemperature.subscribe(function(value) {
        console.log("tank temperature changed:", value);
    });
});
```

### *waterHeater.evaporatorInletTemperature*
The evaporator inlet temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.evaporatorInletTemperature.read(function(value) {
        console.log("evaporator inlet temperature is:", value);
    });

    waterHeater.evaporatorInletTemperature.subscribe(function(value) {
        console.log("evaporator inlet temperature changed:", value);
    });
});
```

### *waterHeater.evaporatorOutletTemperature*
The evaporator outlet temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.evaporatorOutletTemperature.read(function(value) {
        console.log("evaporator outlet temperature is:", value);
    });

    waterHeater.evaporatorOutletTemperature.subscribe(function(value) {
        console.log("evaporator outlet temperature changed:", value);
    });
});
```

### *waterHeater.compressorOutputTemperature*
The compressor output temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.compressorOutputTemperature.read(function(value) {
        console.log("compressor output temperature is:", value);
    });

    waterHeater.compressorOutputTemperature.subscribe(function(value) {
        console.log("compressor output temperature changed:", value);
    });
});
```

### *waterHeater.ambientTemperature*
The ambient temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.ambientTemperature.read(function(value) {
        console.log("ambient temperature is:", value);
    });

    waterHeater.ambientTemperature.subscribe(function(value) {
        console.log("ambient temperature changed:", value);
    });
});
```

### *waterHeater.dlbCurrent*
The DLB current is a read-only integer value with units in tenths of Amps.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.dlbCurrent.read(function(value) {
        console.log("dlb current is:", value);
    });

    waterHeater.dlbCurrent.subscribe(function(value) {
        console.log("dlb current changed:", value);
    });
});
```

### *waterHeater.lineVoltage*
The line voltage is a read-only integer value with units in tenths of volts.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.lineVoltage.read(function(value) {
        console.log("line voltage is:", value);
    });

    waterHeater.lineVoltage.subscribe(function(value) {
        console.log("line voltage changed:", value);
    });
});
```

### *waterHeater.stepperMotorPosition*
The stepper motor position is a read-only integer value.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.stepperMotorPosition.read(function(value) {
        console.log("stepper motor position is:", value);
    });

    waterHeater.stepperMotorPosition.subscribe(function(value) {
        console.log("stepper motor position changed:", value);
    });
});
```

### *waterHeater.relayStates*
The relay states are a read-only integer value of the [relay states](#relay-states) bit field.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.relayStates.read(function(value) {
        console.log("relay states are:", value);
    });

    waterHeater.relayStates.subscribe(function(value) {
        console.log("relay states changed:", value);
    });
});
```

### *waterHeater.flowEvents*
The flow events are a read-only integer value of the [flow events](#flow-events) bit field.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.flowEvents.read(function(value) {
        console.log("flow events are:", value);
    });

    waterHeater.flowEvents.subscribe(function(value) {
        console.log("flow events changed:", value);
    });
});
```

### *waterHeater.resolvedElement*
The resolved element is a read-only integer value of the [resolved element](#resolved-element) enumeration.
The resolved element is the heating element that the software has resolved to use based on the thermistors, flow events, and fault conditions.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.resolvedElement.read(function(value) {
        console.log("resolved element is:", value);
    });

    waterHeater.resolvedElement.subscribe(function(value) {
        console.log("resolved element changed:", value);
    });
});
```

### *waterHeater.compressorMinimumOnOffTimeState*
The compressor minimum on off time state is a read-only integer value of the [on-off time state](#on-off-time-state) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.compressorMinimumOnOffTimeState.read(function(value) {
        console.log("compressor minimum on off time state is:", value);
    });

    waterHeater.compressorMinimumOnOffTimeState.subscribe(function(value) {
        console.log("compressor minimum on off time state changed:", value);
    });
});
```

### *waterHeater.sealedSystemRunState*
The sealed system run state is a read-only integer value of the [sealed system run state](#sealed-system-run-state) enumeration.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.sealedSystemRunState.read(function(value) {
        console.log("sealed system run state is:", value);
    });

    waterHeater.sealedSystemRunState.subscribe(function(value) {
        console.log("sealed system run state changed:", value);
    });
});
```

### *waterHeater.currentKeysPressed*
The current keys pressed is a read-only integer value of the [keys pressed](#keys-pressed) bit field.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.currentKeysPressed.read(function(value) {
        console.log("current keys pressed is:", value);
    });

    waterHeater.currentKeysPressed.subscribe(function(value) {
        console.log("current keys pressed changed:", value);
    });
});
```

### *waterHeater.mixingValveTemperature*
The mixing valve temperature is a read-only integer value with units in degrees Fahrenheit.

``` javascript
var greenBean = require("green-bean");

greenBean.connect("water-heater", function(waterHeater) {
    waterHeater.mixingValveTemperature.read(function(value) {
        console.log("mixing valve temperature is:", value);
    });

    waterHeater.mixingValveTemperature.subscribe(function(value) {
        console.log("mixing valve temperature changed:", value);
    });
});
```

### Appendix

#### Unit Mode
The following is a list of unit modes and their enumerated value.

| Value   | Name              |
|:-------:|:------------------|
| 0       | None              |
| 1       | Hybrid            |
| 2       | Standard Electric |
| 3       | eHeat             |
| 4       | High Demand       |
| 5       | Vacation          |

#### Available Modes
The following is a diagram of the value for each bit in the available modes.
If the bit is set (value is 1) then that mode is available.
If the bit is cleared (value is 0) then that mode is not available.

| Bit     | Description       |
|:-------:|:------------------|
| 0       | Hybrid            |
| 1       | Standard Electric |
| 2       | eHeat             |
| 3       | High Demand       |
| 4       | Vacation          |
| 5+      | Reserved          |

#### Model Features
The following is a diagram of the value for each bit in the model features.
If the bit is set (value is 1) then that feature is available.
If the bit is cleared (value is 0) then that feature is not available.

| Bit     | Description                  |
|:-------:|:-----------------------------|
| 0       | Commercial Model             |
| 1       | Timed Standard Electric Mode |
| 2+      | Reserved                     |

#### Relay States
The following is a diagram of the value for each bit in the relay states.
If the bit is set (value is 1) then that relay is on.
If the bit is cleared (value is 0) then that relay is off.

| Bit     | Description                |
|:-------:|:---------------------------|
| 0       | DLB                        |
| 1       | Compressor                 |
| 2       | Lower Element              |
| 3       | Upper Element              |
| 4       | Fan                        |
| 5+      | Reserved                   |

#### Flow Events
The following is a diagram of the value for each bit in the pressed keys.
If the bit is set (value is 1) then that flow event is set.
If the bit is cleared (value is 0) then that flow event is not set.

| Bit     | Description                |
|:-------:|:---------------------------|
| 0       | Small Flow Event           |
| 1       | Medium Flow Event          |
| 2       | Large Flow Event           |
| 3+      | Reserved                   |

#### Resolved Element
The following is a list of the resolved elements and their enumerated value.

| Value   | Name                          |
|:-------:|:------------------------------|
| 0       | None                          |
| 1       | Upper Element                 |
| 2       | Lower Element                 |
| 3       | Compressor                    |
| 4       | Compressor with Lower Element |

#### On-Off Time State
The following is a list of the on-off time states and their enumerated value.

| Value   | Name              |
|:-------:|:------------------|
| 0       | Ready             |
| 1       | Waiting           |

#### Sealed System Run State
The following is a list of the sealed system run states and their enumerated value.

| Value   | Name                    |
|:-------:|:------------------------|
| 0       | Uninitialized           |
| 1       | Idle                    |
| 2       | Minimum Off Time        |
| 3       | Startup Checks          |
| 4       | Checking Valve Position |
| 5       | Run                     |

#### Keys Pressed
The following is a diagram of the value for each bit in the pressed keys.
If the bit is set (value is 1) then that key is pressed.
If the bit is cleared (value is 0) then that key is not pressed.

| Bit     | Description       |
|:-------:|:------------------|
| 0+      | Reserved          |
