import {
	Text as DefaultText,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { HapticPressable } from "./HapticPressable";
import { useState } from "react";
import { useInvertColors } from "@/contexts/InvertColorsContext";

const weatherVariables = [
	"Temp",
	"Feels Like",
	"Precip Chance",
	"Precip Amount",
	"Wind Speed",
	"Wind Gusts",
	"UV Index",
	"Humidity",
	"Dew Point",
	"Cloud Cover",
	"Visibility",
	"Pressure",
];

interface WeatherVariableSelectorProps {
	onSelectionChange: (variable: string) => void;
}

export default function WeatherVariableSelector({
	onSelectionChange,
}: WeatherVariableSelectorProps) {
	const { invertColors } = useInvertColors();

	const [selectedVariable, setSelectedVariable] = useState<string>(
		weatherVariables[0]
	);
	const handlePress = (variable: string) => {
		setSelectedVariable(variable);
		onSelectionChange(variable);
	};

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			overScrollMode="never"
			style={{ paddingTop: 32, paddingBottom: 1 }}
		>
			{weatherVariables.map((variable) => (
				<HapticPressable
					key={variable}
					onPress={() => handlePress(variable)}
				>
					<View
						style={[
							styles.pill,
							{
								borderColor: invertColors ? "black" : "white",
								backgroundColor: invertColors
									? "white"
									: "black",
							},
							selectedVariable === variable && {
								backgroundColor: invertColors
									? "black"
									: "white",
							},
						]}
					>
						<DefaultText
							style={[
								styles.text,
								{ color: invertColors ? "black" : "white" },
								selectedVariable === variable && {
									color: invertColors ? "white" : "black",
								},
							]}
						>
							{variable}
						</DefaultText>
					</View>
				</HapticPressable>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	text: {
		fontFamily: "PublicSans-Regular",
		fontSize: 16,
	},
	pill: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 20,
		borderWidth: 1,
		marginRight: 6,
	},
});
