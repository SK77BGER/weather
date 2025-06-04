import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TemperatureUnit = "Celsius" | "Fahrenheit";
export type WindSpeedUnit = "km/h" | "m/s" | "mph" | "Knots";
export type PrecipitationUnit = "Millimeter" | "Inch";

interface UnitsContextType {
	temperatureUnit: TemperatureUnit;
	setTemperatureUnit: (unit: TemperatureUnit) => void;
	windSpeedUnit: WindSpeedUnit;
	setWindSpeedUnit: (unit: WindSpeedUnit) => void;
	precipitationUnit: PrecipitationUnit;
	setPrecipitationUnit: (unit: PrecipitationUnit) => void;
}

const UnitsContext = createContext<UnitsContextType>({
	temperatureUnit: "Celsius",
	setTemperatureUnit: () => {},
	windSpeedUnit: "km/h",
	setWindSpeedUnit: () => {},
	precipitationUnit: "Millimeter",
	setPrecipitationUnit: () => {},
});

export const useUnits = () => useContext(UnitsContext);

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
	const [temperatureUnit, setTemperatureUnitState] =
		useState<TemperatureUnit>("Celsius");
	const [windSpeedUnit, setWindSpeedUnitState] =
		useState<WindSpeedUnit>("km/h");
	const [precipitationUnit, setPrecipitationUnitState] =
		useState<PrecipitationUnit>("Millimeter");

	useEffect(() => {
		AsyncStorage.getItem("temperatureUnit").then((value) => {
			if (value !== null) {
				setTemperatureUnitState(value as TemperatureUnit);
			}
		});
		AsyncStorage.getItem("windSpeedUnit").then((value) => {
			if (value !== null) {
				setWindSpeedUnitState(value as WindSpeedUnit);
			}
		});
		AsyncStorage.getItem("precipitationUnit").then((value) => {
			if (value !== null) {
				setPrecipitationUnitState(value as PrecipitationUnit);
			}
		});
	}, []);

	const setTemperatureUnit = async (unit: TemperatureUnit) => {
		setTemperatureUnitState(unit);
		await AsyncStorage.setItem("temperatureUnit", unit);
	};

	const setWindSpeedUnit = async (unit: WindSpeedUnit) => {
		setWindSpeedUnitState(unit);
		await AsyncStorage.setItem("windSpeedUnit", unit);
	};

	const setPrecipitationUnit = async (unit: PrecipitationUnit) => {
		setPrecipitationUnitState(unit);
		await AsyncStorage.setItem("precipitationUnit", unit);
	};

	return (
		<UnitsContext.Provider
			value={{
				temperatureUnit,
				setTemperatureUnit,
				windSpeedUnit,
				setWindSpeedUnit,
				precipitationUnit,
				setPrecipitationUnit,
			}}
		>
			{children}
		</UnitsContext.Provider>
	);
};
