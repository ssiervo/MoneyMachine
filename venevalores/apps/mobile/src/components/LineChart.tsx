import React from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { View } from 'react-native';

export interface Point {
  x: Date;
  y: number;
}

interface Props {
  data: Point[];
}

const formatTick = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const LineChart: React.FC<Props> = ({ data }) => (
  <View>
    <VictoryChart theme={VictoryTheme.material} scale={{ x: 'time' }} height={220}>
      <VictoryAxis fixLabelOverlap tickFormat={formatTick}></VictoryAxis>
      <VictoryAxis dependentAxis tickFormat={(t) => `${t}`}></VictoryAxis>
      <VictoryLine
        data={data}
        style={{ data: { stroke: '#1d4ed8', strokeWidth: 2 } }}
      />
    </VictoryChart>
  </View>
);

export default LineChart;
