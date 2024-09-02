import {useWindowDimensions} from 'react-native';
import React from 'react';
import {useDerivedValue} from 'react-native-reanimated';
import {Canvas, Text} from '@shopify/react-native-skia';


const AnimatedText = ({selectedValue, font}) => {
  const {width} = useWindowDimensions();
  const MARGIN_VERTICAL = 25;

  const animatedText = useDerivedValue(() => {
    return `${Math.round(selectedValue.value)}`;
  });

  const fontSize = font?.measureText('0');

  const textX = useDerivedValue(() => {
    const _fontSize = font?.measureText(animatedText.value);
    return width / 2 - _fontSize.width / 2;
  }, []);

  return (
    <Canvas style={{height: fontSize.height + MARGIN_VERTICAL}}>
      <Text text={animatedText} className="justify-center" font={font} color={'black'} x={textX} y={fontSize.height + MARGIN_VERTICAL / 2}/>
    </Canvas>
  );
};

export default AnimatedText;