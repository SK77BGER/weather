import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import WeatherVariableSelector from "@/components/WeatherVariableSelector";
import CustomScrollView from "@/components/CustomScrollView";
import { useCurrentLocation } from "@/contexts/CurrentLocationContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";

export default function CurrentLocationScreen() {
	const { currentLocation, weatherData, errorMsg, dataLoaded, refetchWeather } =
		useCurrentLocation();
	const { invertColors } = useInvertColors();
	const [selectedWeatherVariable, setSelectedWeatherVariable] =
		useState<string>("Temp");

	useFocusEffect(
		useCallback(() => {
			if (dataLoaded) {
				refetchWeather();
			}
		}, [dataLoaded, refetchWeather])
	);

	// Show blank screen with correct background color while loading
	if (!dataLoaded) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: invertColors ? "white" : "black",
				}}
			/>
		);
	}

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
