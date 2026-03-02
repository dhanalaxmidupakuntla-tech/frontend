export default function useUserLevel(accuracy) {
  if (accuracy >= 90) return "Advanced";
  if (accuracy >= 70) return "Intermediate";
  return "Beginner";
}