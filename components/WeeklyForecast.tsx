import React from "react";
import { View, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { StyledText } from "@/components/StyledText";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { WeatherData } from "@/utils/weather";
import IconDirectionUp from "@/assets/weather/wi-direction-up.svg";
import { useUnits } from "@/contexts/UnitsContext";

interface WeeklyForecastProps {
	weeklyData?: WeatherData["daily"];
	selectedWeatherVariable: string;
}

interface DailyVariableData {
	value: string;
	unit: string;
	value2?: string;
	unit2?: string;
	windAngle?: number;
}

const getDailyVariableData = (
	dailyData: WeatherData["daily"],
	variableName: string,
	index: number,
	units: ReturnType<typeof useUnits>
): DailyVariableData => {
	const { windSpeedUnit, precipitationUnit } = units;

	switch (variableName) {
		case "Temp":
			return {
				value: dailyData.temperature2mMin[index].toFixed(0),
				unit: "°",
				value2: dailyData.temperature2mMax[index].toFixed(0),
				unit2: "°",
			};
		case "Feels Like":
			return {
				value: dailyData.apparentTemperatureMin[index].toFixed(0),
				unit: "°",
				value2: dailyData.apparentTemperatureMax[index].toFixed(0),
				unit2: "°",
			};
		case "Precip Chance":
			return {
				value: dailyData.precipitationProbabilityMax[index].toFixed(0),
				unit: "%",
			};
		case "Precip Amount":
			return {
				value: dailyData.precipitationSum[index].toFixed(2),
				unit: precipitationUnit === "Millimeter" ? "mm" : "in",
			};
		case "Wind Speed":
			return {
				value: dailyData.windSpeed10mMax[index].toFixed(0),
				unit: windSpeedUnit,
				windAngle: dailyData.windDirection10mDominant[index],
			};
		case "Wind Gusts":
			return {
				value: dailyData.windGusts10mMax[index].toFixed(0),
				unit: windSpeedUnit,
			};
		case "UV Index":
			return {
				value: dailyData.uvIndexMax[index].toFixed(1),
				unit: "",
			};
		case "Humidity":
			return {
				value: dailyData.relativeHumidity2mMean[index].toFixed(0),
				unit: "%",
			};
		case "Dew Point":
			return {
				value: dailyData.dewPoint2mMean[index].toFixed(0),
				unit: "°",
			};
		case "Cloud Cover":
			return {
				value: dailyData.cloudCoverMean[index].toFixed(0),
				unit: "%",
			};
		case "Visibility":
			return {
				value: (dailyData.visibilityMean[index] / 1000).toFixed(1),
				unit: "km",
			};
		case "Pressure":
			return {
				value: dailyData.surfacePressureMean[index].toFixed(0),
				unit: "hPa",
			};
		default:
			return {
				value: dailyData.temperature2mMin[index].toFixed(0),
				unit: "°",
				value2: dailyData.temperature2mMax[index].toFixed(0),
				unit2: "°",
			};
	}
};

export default function WeeklyForecast({
	weeklyData,
	selectedWeatherVariable,
}: WeeklyForecastProps) {
	const { invertColors } = useInvertColors();
	const units = useUnits();
	return (
		<View style={{ paddingTop: 16 }}>
			<StyledText style={{ fontSize: 20, paddingBottom: 4 }}>
				Weekly Forecast
			</StyledText>
			{weeklyData?.time.map((_, index) => {
				const WeatherIconComponent = getWeatherIcon(
					weeklyData.weatherCode[index] as number,
					1 // isDay is always true for daily summary
				);

				const { value, unit, value2, unit2, windAngle } =
					getDailyVariableData(
						weeklyData,
						selectedWeatherVariable,
						index,
						units
					);

				return (
					<View key={index} style={styles.hourlyItem}>
						<WeatherIconComponent
							width={32}
							height={32}
							fill={invertColors ? "black" : "white"}
						/>
						<StyledText style={{ fontSize: 20, paddingLeft: 8 }}>
							{weeklyData.time[index].toLocaleDateString("en-US", {
								weekday: "long",
								timeZone: "UTC",
							})}
							{" - "}
							{value2
								? `L:${value}${unit} H:${value2}${unit2}`
								: `${value}${unit}`}
							{typeof windAngle === "number" && (
								<View
									style={[
										{
											flexDirection: "row",
											alignItems: "center",
										},
										{
											transform: [
												{ rotate: `${windAngle}deg` },
											],
										},
									]}
								>
									<IconDirectionUp
										width={20}
										height={20}
										fill={invertColors ? "black" : "white"}
									/>
								</View>
							)}
						</StyledText>
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	hourlyItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 0,
	},
});
