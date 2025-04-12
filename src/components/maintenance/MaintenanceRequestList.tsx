
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserMaintenanceRequests } from "@/lib/api/maintenance";
import { MaintenanceRequest } from "@/types/maintenance";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MaintenanceRequestDetails } from "./MaintenanceRequestDetails";

interface MaintenanceRequestListProps {
  refreshTrigger?: number;
}

export function MaintenanceRequestList({ refreshTrigger = 0 }: MaintenanceRequestListProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getUserMaintenanceRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user, refreshTrigger]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No maintenance requests found. Submit a request to get help.
      </Card>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedRequestId(request.id)}
            >
              <TableCell className="font-medium">{request.issue_type}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</TableCell>
              <TableCell>{request.cost ? `$${request.cost}` : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MaintenanceRequestDetails
        requestId={selectedRequestId}
        isOpen={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
      />
    </div>
  );
}
