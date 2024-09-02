import React from 'react';
import {Circle, Group, Path, Skia} from '@shopify/react-native-skia';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';


const Cursor = ({cx, cy, chartHeight}) => {
  const path = useDerivedValue(() => {
    const dottedLine = Skia.Path.Make().lineTo(0, chartHeight - cy.value - 20);
    dottedLine.dash(10, 10, 0);

    const matrix = Skia.Matrix();
    matrix.translate(cx.value, cy.value);
    dottedLine.transform(matrix);

    return dottedLine;
  });

  return (
    <Group>
      <Path path={path} color="#eaf984" style="stroke" strokeJoin="round" strokeWidth={2}/>
      <Circle r={10} cx={cx} cy={cy} strokeWidth={10} color={'#FFDB58'} style={'stroke'}/>
      <Circle r={10} cx={cx} cy={cy} color={'#0d0d0d'} style={'fill'} />
    </Group>
  );
};

export default Cursor;