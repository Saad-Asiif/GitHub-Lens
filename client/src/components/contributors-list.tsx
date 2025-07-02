interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  percentage: number;
}

interface ContributorsListProps {
  contributors: Contributor[];
}

export function ContributorsList({ contributors }: ContributorsListProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        👥 Top Contributors
      </h3>
      <div className="space-y-4">
        {contributors.slice(0, 5).map((contributor, index) => (
          <div key={contributor.login} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${contributor.login}&background=random`;
                }}
              />
              <div>
                <div className="font-medium">{contributor.login}</div>
                <div className="text-sm text-muted-foreground">
                  {contributor.contributions.toLocaleString()} commits
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{contributor.percentage}%</div>
              <div className="text-xs text-muted-foreground">of total</div>
            </div>
          </div>
        ))}
        
        {contributors.length > 5 && (
          <button className="w-full text-center text-primary hover:underline text-sm mt-4">
            View all contributors
          </button>
        )}
      </div>
    </div>
  );
}
