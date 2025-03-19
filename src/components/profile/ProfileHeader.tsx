
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfileHeader() {
  // Mock user data - in a real app, this would come from your auth system
  const user = {
    id: "USR-12345",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg",
    role: "Tenant",
    joinDate: "January 2023",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge variant="outline" className="w-fit text-xs">
                ID: {user.id}
              </Badge>
              <Badge variant="secondary" className="w-fit">
                {user.role}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">Member since {user.joinDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
