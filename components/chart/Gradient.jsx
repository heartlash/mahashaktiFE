import React from 'react';
import {LinearGradient, Path, Skia} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';


const Gradient = ({
  chartHeight,
  chartWidth,
  chartMargin,
  curvedLine,
  animationGradient,
}) => {
  const getGradientArea = (
    chartLine,
    width,
    height,
  ) => {
    // Create a path from the chart line
    const gradientAreaSplit = Skia.Path.MakeFromSVGString(chartLine);

    // Close the path if exists
    if (gradientAreaSplit) {
      gradientAreaSplit
        // add line to the bottom right corner
        .lineTo(width - chartMargin, height)
        // add line to the bottom left corner
        .lineTo(chartMargin, height)
        // add line to the first point
        .lineTo(chartMargin, gradientAreaSplit.getPoint(0).y);
    }

    return gradientAreaSplit;
  };
  return (
    <Path path={getGradientArea(curvedLine, chartWidth, chartHeight)}>
      <LinearGradient start={{x: 0, y: 0}} end={animationGradient} 
      colors={['rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0)']}
      />
    </Path>
  );
};

export default Gradient;