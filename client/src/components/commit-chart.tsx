import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CommitChartProps {
  data: Array<{ month: string; commits: number }>;
}

export function CommitChart({ data }: CommitChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        📈 Commit Activity (Last 12 Months)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgb(201, 209, 217)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgb(201, 209, 217)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(33, 38, 45)',
                border: '1px solid rgb(48, 54, 61)',
                borderRadius: '6px',
                color: 'rgb(201, 209, 217)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="commits" 
              stroke="#58a6ff" 
              strokeWidth={3}
              dot={{ fill: '#58a6ff', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#58a6ff', fill: '#58a6ff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
