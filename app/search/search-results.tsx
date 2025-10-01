import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import { GeocodingResult, searchLocations } from "@/utils/geocoding";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import CustomScrollView from "@/components/CustomScrollView";
import iso311a2 from "iso-3166-1-alpha-2";

export default function SearchResultsScreen() {
	const { query } = useLocalSearchParams<{ query?: string }>();
	const [results, setResults] = useState<GeocodingResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { invertColors } = useInvertColors();

	useEffect(() => {
		if (query) {
			const fetchResults = async () => {
				setLoading(true);
				setError(null);
				try {
					const data = await searchLocations(query);
					if (data.length === 0) {
						setError("No results found for your query.");
					}
					setResults(data);
				} catch (e) {
					console.error(e);
					setError(
						"Failed to fetch search results. Please try again."
					);
				} finally {
					setLoading(false);
				}
			};
			fetchResults();
		} else {
			setLoading(false);
			setError("No search query provided.");
		}
	}, [query]);

	const handlePressLocation = (location: GeocodingResult) => {
		router.push({
			pathname: "/search/location-weather",
			params: {
				latitude: location.latitude.toString(),
				longitude: location.longitude.toString(),
				name: location.name,
                admin1: location.admin1 ?? "",
				country: iso311a2.getCountry(location.country_code),
				id: location.id.toString(),
			},
		} as any);
	};

	return (
		<ContentContainer
			headerTitle={`Results for "${query || ""}"`}
			style={{ paddingBottom: 20 }}
		>
			<CustomScrollView style={styles.container}>
				{loading && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
					>
						Loading...
					</Text>
				)}
				{error && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
					>
						{error}
					</Text>
				)}
				{!loading && !error && results.length === 0 && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
					>
						No results found.
					</Text>
				)}
				{!loading &&
					!error &&
					results.map((location) => (
						<View key={location.id} style={{ marginBottom: 16 }}>
							<StyledButton
								text={`${location.name}${
									location.admin1 &&
									location.admin1 !== location.name
										? `, ${location.admin1}`
										: ""
								}, ${iso311a2.getCountry(location.country_code)}`}
								onPress={() => handlePressLocation(location)}
								fontSize={28}
							/>
						</View>
					))}
			</CustomScrollView>
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	messageText: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: "PublicSans-Regular",
	},
});
