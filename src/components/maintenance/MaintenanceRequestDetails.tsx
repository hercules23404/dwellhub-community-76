
import { useEffect, useState } from "react";
import { getMaintenanceRequestById } from "@/lib/api/maintenance";
import { MaintenanceRequest } from "@/types/maintenance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { Loader2 } from "lucide-react";

interface MaintenanceRequestDetailsProps {
  requestId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceRequestDetails({ requestId, isOpen, onClose }: MaintenanceRequestDetailsProps) {
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;
      
      setLoading(true);
      try {
        const data = await getMaintenanceRequestById(requestId);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && requestId) {
      fetchRequestDetails();
    } else {
      setRequest(null);
    }
  }, [requestId, isOpen]);

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Maintenance Request Details</DialogTitle>
          {request && (
            <DialogDescription>
              Submitted {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : request ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Type:</p>
                <p>{request.issue_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <div>{getStatusBadge(request.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Submitted:</p>
                <p>{format(new Date(request.created_at), 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost:</p>
                <p>{request.cost ? `$${request.cost}` : "Not assigned"}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description:</p>
              <p className="mt-1 whitespace-pre-wrap">{request.description}</p>
            </div>
            
            {request.assigned_worker_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Worker:</p>
                <p>{request.assigned_worker_id || "Not assigned yet"}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No request details available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
