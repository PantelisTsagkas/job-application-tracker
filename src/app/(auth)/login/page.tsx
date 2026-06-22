import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { githubEnabled, googleEnabled } from "@/lib/auth";
import { LoginButtons } from "./LoginButtons";

export default function LoginPage() {
  return (
    <Card className="w-full rounded-xl border border-border">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center">
          <Briefcase className="h-10 w-10 text-indigo-500" />
        </div>
        <CardTitle className="text-2xl font-bold">JobTracker</CardTitle>
        <CardDescription>Sign in to track your applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <LoginButtons github={githubEnabled} google={googleEnabled} />
      </CardContent>
    </Card>
  );
}
