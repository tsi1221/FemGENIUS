export interface Badge {
  icon: string;
  label: string;
}

export interface UserProfile {
  points: number;
  streak: number;
  goalsCompleted: number;
  badges: Badge[];
  completedActions: string[];
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch("/api/profile");
  return response.json();
};

export const trackAction = async (action: string, points: number, badge?: Badge) => {
  const response = await fetch("/api/gamification/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, points, badge }),
  });
  return response.json();
};

export const trackGoalCompletion = async () => {
  const response = await fetch("/api/gamification/goal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};
