import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Attribute } from '../types/game';

interface RadarChartProps {
    data: Attribute[]; // Expecting 5 attributes in order: Int, Str, Luv, Net, Fam
    maxValue?: number;
    size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, maxValue = 10, size = 300 }) => {
    const center = size / 2;
    const radius = (size * 0.8) / 2;
    const angleSlice = (Math.PI * 2) / 5;

    // Helper to get coordinates
    const getCoordinates = (value: number, index: number, max: number) => {
        const angle = index * angleSlice - Math.PI / 2; // Start at top
        // Normalize value: If value > max, cap it visually or rely on max logic? 
        // For now, let's just log scaling.
        const normalized = Math.min(value / max, 1);
        const x = center + Math.cos(angle) * (radius * normalized);
        const y = center + Math.sin(angle) * (radius * normalized);
        return { x, y };
    };

    // Background Webs (Concentric Pentagons)
    const webs = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
        const points = Array.from({ length: 5 }).map((_, i) => {
            const { x, y } = getCoordinates(maxValue * scale, i, maxValue);
            return `${x},${y}`;
        }).join(' ');
        return points;
    });

    // Data Polygon
    const dataPoints = data.map((attr, i) => {
        // We use level as the metric to display? Or XP? Level is 1-50+.
        // Let's use Level.
        // Dynamic Max: if user is level 20, max should be 20 or 25.
        const { x, y } = getCoordinates(attr.level, i, maxValue);
        return `${x},${y}`;
    }).join(' ');

    // Axis Lines & Labels
    const axes = data.map((attr, i) => {
        const { x, y } = getCoordinates(maxValue * 1.1, i, maxValue);
        const lineEnd = getCoordinates(maxValue, i, maxValue);
        return {
            label: { x, y, text: attr.name.substring(0, 3).toUpperCase() },
            line: { x1: center, y1: center, x2: lineEnd.x, y2: lineEnd.y }
        };
    });

    return (
        <View style={styles.container}>
            <Svg height={size} width={size}>
                {/* Webs */}
                {webs.map((points, i) => (
                    <Polygon
                        key={`web-${i}`}
                        points={points}
                        stroke={Colors.border}
                        strokeWidth="1"
                        fill="none"
                    />
                ))}

                {/* Axes */}
                {axes.map((axis, i) => (
                    <Line
                        key={`axis-${i}`}
                        x1={axis.line.x1}
                        y1={axis.line.y1}
                        x2={axis.line.x2}
                        y2={axis.line.y2}
                        stroke={Colors.border}
                        strokeWidth="1"
                    />
                ))}

                {/* Data Shape */}
                <Polygon
                    points={dataPoints}
                    fill={Colors.primary}
                    fillOpacity="0.3"
                    stroke={Colors.primary}
                    strokeWidth="2"
                />

                {/* Data Points (Dots) */}
                {data.map((attr, i) => {
                    const { x, y } = getCoordinates(attr.level, i, maxValue);
                    return (
                        <Circle
                            key={`dot-${i}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={Colors.attributes[attr.name]}
                        />
                    )
                })}

                {/* Labels */}
                {axes.map((axis, i) => (
                    <SvgText
                        key={`label-${i}`}
                        x={axis.label.x}
                        y={axis.label.y}
                        fill={Colors.text}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {axis.label.text}
                    </SvgText>
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default RadarChart;
