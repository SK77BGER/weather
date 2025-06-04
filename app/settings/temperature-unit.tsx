import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useUnits, TemperatureUnit } from "@/contexts/UnitsContext";

export default function TemperatureUnitScreen() {
	const { setTemperatureUnit } = useUnits();

	const handleUnitSelect = (unit: TemperatureUnit) => {
		setTemperatureUnit(unit);
		router.back();
	};

	const { temperatureUnit } = useUnits();

	return (
		<ContentContainer headerTitle="Customise">
			<StyledButton
				text="Celsius"
				onPress={() => handleUnitSelect("Celsius")}
				underline={temperatureUnit === "Celsius"}
			/>
			<StyledButton
				text="Fahrenheit"
				onPress={() => handleUnitSelect("Fahrenheit")}
				underline={temperatureUnit === "Fahrenheit"}
			/>
		</ContentContainer>
	);
}
