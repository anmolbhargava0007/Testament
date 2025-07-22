import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
} from 'recharts';

const COLORS = ['#FF4D4F', '#52C41A']; // Failed, Passed

interface Props {
  data: {
    failed?: number;
    passed?: number;
    [key: string]: any;
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white border shadow-sm rounded px-3 py-2 text-sm">
        <strong>{name}:</strong> {value}
      </div>
    );
  }
  return null;
};

const PieChart: React.FC<Props> = ({ data }) => {
  const COLOR_MAP: Record<string, string> = {
    Failed: '#FF4D4F',
    Passed: '#52C41A',
  };

  const failed = data?.failed || 0;
  const passed = data?.passed || 0;

  const [showFailed, setShowFailed] = useState(true);
  const [showPassed, setShowPassed] = useState(true);

  const chartData = [
    showFailed ? { name: 'Failed', value: failed } : null,
    showPassed ? { name: 'Passed', value: passed } : null,
  ]
    .filter(Boolean)
    .filter((item) => item!.value > 0); // remove 0s and nulls

  const handleToggle = (type: 'failed' | 'passed') => {
    if (type === 'failed') setShowFailed((prev) => !prev);
    if (type === 'passed') setShowPassed((prev) => !prev);
  };

  if (chartData.length === 0) {
    return <p className="text-muted text-center mt-4">No data to visualize</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            isAnimationActive={true}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLOR_MAP[entry.name]}
                stroke="#fff"
                strokeWidth={2}
                style={{ outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-6 text-sm">
        <button
          onClick={() => handleToggle('failed')}
          className={`flex items-center gap-2 transition-all ${showFailed ? '' : 'opacity-50'
            }`}
        >
          <span className="w-3 h-3 rounded-full bg-[#FF4D4F] inline-block"></span>
          Failed ({failed})
        </button>
        <button
          onClick={() => handleToggle('passed')}
          className={`flex items-center gap-2 transition-all ${showPassed ? '' : 'opacity-50'
            }`}
        >
          <span className="w-3 h-3 rounded-full bg-[#52C41A] inline-block"></span>
          Passed ({passed})
        </button>
      </div>
    </div>
  );
};

export default PieChart;