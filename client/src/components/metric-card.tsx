interface MetricCardProps {
  title: string;
  score: number;
  description: string;
  icon: string;
}

export function MetricCard({ title, score, description, icon }: MetricCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-gh-success";
    if (score >= 60) return "text-gh-warning";
    return "text-gh-danger";
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return "bg-gh-success";
    if (score >= 60) return "bg-gh-warning";
    return "bg-gh-danger";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${getScoreColor(score)}`}>
        {score}/100
      </div>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>
      <div className="bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
