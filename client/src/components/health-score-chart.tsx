interface HealthScoreChartProps {
  score: number;
}

export function HealthScoreChart({ score }: HealthScoreChartProps) {
  const getHealthDescription = (score: number): string => {
    if (score >= 90) return "Excellent repository health";
    if (score >= 80) return "Very good repository health";
    if (score >= 70) return "Good repository health";
    if (score >= 60) return "Fair repository health";
    return "Needs improvement";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-gh-success";
    if (score >= 60) return "text-gh-warning";
    return "text-gh-danger";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold mb-4">Health Score</h3>
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={getScoreColor(score)}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{getHealthDescription(score)}</p>
    </div>
  );
}
