import { Redirect } from 'expo-router';

/** Flutter's GoRouter initialLocation is '/onboarding'. */
export default function Index() {
  return <Redirect href="/onboarding" />;
}
