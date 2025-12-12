/**
 * Index (Placeholder) Page Component
 *
 * Default/fallback page shown when no other routes match.
 * Currently a placeholder - can be replaced with welcome screen
 * or redirected to dashboard.
 */

/**
 * Index Component
 *
 * Simple welcome page for the application
 * Can be customized or replaced with onboarding flow
 */
const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Graspify</h1>
        <p className="text-xl text-muted-foreground">
          Your AI Learning Companion
        </p>
      </div>
    </div>
  );
};

export default Index;
