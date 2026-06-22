import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginHero } from "@/components/auth/LoginHero";
import { githubEnabled, googleEnabled } from "@/lib/auth";
import { LoginButtons } from "./LoginButtons";

export default function LoginPage() {
  const hasProviders = githubEnabled || googleEnabled;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginHero />

      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md shadow-lg ring-1 ring-foreground/5">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to pick up where you left off
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {hasProviders ? (
              <>
                <LoginButtons github={githubEnabled} google={googleEnabled} />
                <div className="relative">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    Secure OAuth sign-in
                  </span>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  We never see your password — your provider handles
                  authentication.
                </p>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
                No sign-in providers are configured. Add GitHub or Google OAuth
                credentials to your environment to enable login.
              </p>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t bg-muted/30 py-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to use JobTracker for your personal job
            search tracking.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
