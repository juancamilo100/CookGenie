/*
 * Copyright (c) 2014 General Electric
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 */

const WATER_HEATER_BASE = 0x4000;
const WATER_HEATER_MODE_BASE = 0x4020;
const WATER_HEATER_UNIT_BASE = 0x4040;
const WATER_HEATER_SENSOR_BASE = 0x4060;

function WaterHeaterMode(bus, appliance, base) {
    appliance.userSelectedMode = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.operatingMode = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.drmFallbackMode = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.vacationFallbackMode = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.userSetpoint = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.vacationSetpoint = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.actualSetpoint = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.vacationFallbackSetpoint = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.timedModeHoursRemaining = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });
}

function WaterHeaterUnit(bus, appliance, base) {
    appliance.availableModes = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.tankSize = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.modelDesignator = appliance.erd({
        erd: base++,
        format: "Ascii"
    });

    appliance.compressorRuntime = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.dirtyFilterPercentage = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.faultCounters = appliance.erd({
        erd: base++,
        format: "Bytes"
    });

    appliance.activeFaultCodes = appliance.erd({
        erd: base++,
        format: "Bytes"
    });

    appliance.allowedNormalSetpoints = appliance.erd({
        erd: base++,
        endian: "big",
        format: [
            "minimumAllowedNormalSetpoint:UInt16",
            "maximumAllowedNormalSetpoint:UInt16"
        ]
    });

    appliance.allowedVacationSetpoints = appliance.erd({
        erd: base++,
        endian: "big",
        format: [
            "minimumAllowedVacationSetpoint:UInt16",
            "maximumAllowedVacationSetpoint:UInt16"
        ]
    });

    appliance.maximumAllowedVacationHours = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.maximumAllowedStandardElectricHours = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.modelFeatures = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });
}

function WaterHeaterSensors(bus, appliance, base) {
    appliance.tankTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.evaporatorInletTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.evaporatorOutletTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.compressorOutputTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.ambientTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.dlbCurrent = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.lineVoltage = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.stepperMotorPosition = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.relayStates = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });

    appliance.flowEvents = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.resolvedElement = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.compressorMinimumOnOffTimeState = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.sealedSystemRunState = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.currentKeysPressed = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.mixingValveTemperature = appliance.erd({
        erd: base++,
        endian: "big",
        format: "UInt16"
    });
}

function WaterHeater (bus, appliance, base) {
    WaterHeaterMode(bus, appliance, WATER_HEATER_MODE_BASE);
    WaterHeaterUnit(bus, appliance, WATER_HEATER_UNIT_BASE);
    WaterHeaterSensors(bus, appliance, WATER_HEATER_SENSOR_BASE);

    return appliance;
}

exports.plugin = function (bus, configuration, callback) {
    bus.on("appliance", function (appliance) {
        appliance.read(WATER_HEATER_MODE_BASE, function (value) {
            bus.emit("water-heater", WaterHeater(bus, appliance, WATER_HEATER_BASE));
        });
    });

    var create = bus.create;

    bus.create = function (name, callback) {
        create(name, function (appliance) {
            if (name == "water-heater") {
                appliance.address = configuration.address;
                appliance.version = configuration.version;
                WaterHeater(bus, appliance, WATER_HEATER_BASE);
            }

            callback(appliance);
        });
    };

    callback(bus);
};
