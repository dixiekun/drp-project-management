import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, Clock } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  const stats = [
    {
      title: "Active Clients",
      value: "12",
      icon: Users,
      description: "+2 from last month",
    },
    {
      title: "Active Projects",
      value: "8",
      icon: FolderKanban,
      description: "3 due this week",
    },
    {
      title: "Tasks In Progress",
      value: "24",
      icon: CheckSquare,
      description: "6 blocked",
    },
    {
      title: "Hours This Week",
      value: "32",
      icon: Clock,
      description: "80% of target",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back, {user?.firstName || "User"}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity. Start by creating your first project or client.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
