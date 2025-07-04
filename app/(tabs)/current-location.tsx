import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect, useRef } from "react";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, AppState, AppStateStatus } from "react-native";
import { getWeatherData, WeatherData } from "@/utils/weather";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import WeatherVariableSelector from "@/components/WeatherVariableSelector";
import { useUnits } from "@/contexts/UnitsContext";
import CustomScrollView from "@/components/CustomScrollView";

export default function CurrentLocationScreen() {
	const units = useUnits();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [currentLocation, setCurrentLocation] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [selectedWeatherVariable, setSelectedWeatherVariable] =
		useState<string>("Temp");

	const appState = useRef(AppState.currentState);

	const fetchLocationAndWeather = useCallback(async () => {
		if (!units.unitsLoaded) {
			return;
		}
		
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: "Location Permission",
				message:
					"This app needs access to your location to show current weather.",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK",
			}
		);
		if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
			setErrorMsg("Permission to access location was denied");
			console.log("Location permission denied.");
			return;
		}

		const getCurrentPositionPromise =
			(): Promise<Geolocation.GeoPosition> => {
				return new Promise((resolve, reject) => {
					Geolocation.getCurrentPosition(
						(position) => resolve(position),
						(error) => reject(error),
						{
							enableHighAccuracy: true,
							timeout: 15000,
							maximumAge: 10000,
						}
					);
				});
			};

		try {
			const fetchedLocation = await getCurrentPositionPromise();

			// Set a generic location name as reverse geocoding is removed
			setCurrentLocation("Current Location");

			const data = await getWeatherData(
				fetchedLocation.coords.latitude,
				fetchedLocation.coords.longitude,
				units.temperatureUnit,
				units.windSpeedUnit,
				units.precipitationUnit
			);
			setWeatherData(data);
			setErrorMsg(null); // Clear any previous errors
		} catch (error: any) {
			if (error.code && error.message) {
				setErrorMsg(`Error (code ${error.code}): ${error.message}`);
				console.error("Geolocation error:", error.code, error.message);
			} else {
				setErrorMsg("Error fetching location or weather");
				console.error("Error in focus effect:", error);
			}
		}
	}, [units.temperatureUnit, units.windSpeedUnit, units.precipitationUnit, units.unitsLoaded]);

	useFocusEffect(
		useCallback(() => {
			fetchLocationAndWeather();
		}, [fetchLocationAndWeather])
	);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState: AppStateStatus) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					fetchLocationAndWeather();
				}

				appState.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [fetchLocationAndWeather]);

	return weatherData ? (
		<ContentContainer
			headerTitle={currentLocation?.toString()}
			hideBackButton={true}
		>
			<CustomScrollView style={{ width: "100%" }} overScrollMode="never">
				<CurrentSummary
					currentTemperature={weatherData?.current.temperature2m ?? 0}
					apparentTemperature={
						weatherData?.current.apparentTemperature ?? 0
					}
					maxTemperature={
						weatherData?.daily.temperature2mMax?.[0] as number
					}
					minTemperature={
						weatherData?.daily.temperature2mMin?.[0] as number
					}
					weatherCode={weatherData?.current.weatherCode ?? 0}
					isDay={weatherData?.current.isDay ?? 0}
				/>
				<WeatherVariableSelector
					onSelectionChange={setSelectedWeatherVariable}
				/>
				<HourlyForecast
					hourlyData={weatherData?.hourly}
					dailyData={weatherData?.daily}
					selectedWeatherVariable={selectedWeatherVariable}
				/>
				<WeeklyForecast
					weeklyData={weatherData?.daily}
					selectedWeatherVariable={selectedWeatherVariable}
				/>
			</CustomScrollView>
		</ContentContainer>
	) : (
		<ContentContainer
			headerTitle={currentLocation?.toString()}
			hideBackButton={true}
		></ContentContainer>
	);
}
