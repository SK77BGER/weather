import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import * as Location from "expo-location";
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

	useFocusEffect(
		useCallback(() => {
			(async () => {
				let { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					setErrorMsg("Permission to access location was denied");
					console.log("Location permission denied.");
					return;
				}

				try {
					let fetchedLocation =
						await Location.getCurrentPositionAsync({});
					const reverseGeocode = await Location.reverseGeocodeAsync(
						fetchedLocation.coords
					);

					const currentLocationName =
						reverseGeocode[0].district ??
						reverseGeocode[0].city ??
						reverseGeocode[0].subregion ??
						reverseGeocode[0].formattedAddress
							?.split(",")[1]
							?.trim();
					setCurrentLocation(
						currentLocationName ?? "Location Not Found"
					);

					const data = await getWeatherData(
						fetchedLocation.coords.latitude,
						fetchedLocation.coords.longitude,
						units.temperatureUnit,
						units.windSpeedUnit,
						units.precipitationUnit
					);
					setWeatherData(data);
				} catch (error) {
					setErrorMsg("Error fetching location or weather");
					console.error("Error in focus effect:", error);
				}
			})();
		}, [units])
	);

	return (
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
	);
}
