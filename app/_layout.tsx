import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { HapticProvider } from "../contexts/HapticContext";
import {
	InvertColorsProvider,
	useInvertColors,
} from "../contexts/InvertColorsContext";
import { UnitsProvider } from "../contexts/UnitsContext";
import { CurrentLocationProvider } from "../contexts/CurrentLocationContext";
import { useFonts } from "expo-font";
import { setStatusBarHidden } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigation() {
	useFonts({
		"PublicSans-Regular": require("../assets/fonts/PublicSans-Regular.ttf"),
	});

	useEffect(() => {
		setStatusBarHidden(true, "none");
	}, []);

	const { invertColors } = useInvertColors();

	useEffect(() => {
		const newColor = invertColors ? "#FFFFFF" : "#000000";
		SystemUI.setBackgroundColorAsync(newColor);
	}, [invertColors]);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "none",
				contentStyle: { backgroundColor: "#000000" },
			}}
		></Stack>
	);
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<HapticProvider>
				<InvertColorsProvider>
					<UnitsProvider>
						<CurrentLocationProvider>
							<RootNavigation />
						</CurrentLocationProvider>
					</UnitsProvider>
				</InvertColorsProvider>
			</HapticProvider>
		</SafeAreaProvider>
	);
}
