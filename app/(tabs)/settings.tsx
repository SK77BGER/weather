import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { SelectorButton } from "@/components/SelectorButton";
import { useUnits } from "@/contexts/UnitsContext";
import { View, StyleSheet, Text } from "react-native";
import * as Application from "expo-application";

export default function SettingsScreen() {
	const { invertColors, setInvertColors } = useInvertColors();
	const { temperatureUnit, windSpeedUnit, precipitationUnit } = useUnits();

	return (
		<ContentContainer
			headerTitle="Settings"
			hideBackButton={true}
			style={{ gap: 20 }}
		>
			<SelectorButton
				label="Temperature Unit"
				value={temperatureUnit}
				valueChangePage="/settings/temperature-unit"
			/>
			<SelectorButton
				label="Wind Speed Unit"
				value={windSpeedUnit}
				valueChangePage="/settings/wind-speed-unit"
			/>
			<SelectorButton
				label="Precipitation Unit"
				value={precipitationUnit}
				valueChangePage="/settings/precipitation-unit"
			/>
			<ToggleSwitch
				value={invertColors}
				label="Invert Colours"
				onValueChange={setInvertColors}
			/>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>
                    v{Application.nativeApplicationVersion}
                </Text>
            </View>
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	versionContainer: {
        width: "100%",
		alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
	},
	versionText: {
		color: "#666",
		fontSize: 12,
		fontWeight: "400",
	},
});
