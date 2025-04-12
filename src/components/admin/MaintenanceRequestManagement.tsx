
import { useEffect, useState } from "react";
import { getUserMaintenanceRequests, getUtilityWorkers, updateMaintenanceRequest } from "@/lib/api/maintenance";
import { MaintenanceRequest, UtilityWorker } from "@/types/maintenance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export function MaintenanceRequestManagement() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [workers, setWorkers] = useState<UtilityWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getUserMaintenanceRequests();
      setRequests(data);
      
      // Set default society if we have requests
      if (data.length > 0 && !selectedSociety) {
        setSelectedSociety(data[0].society_id);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    if (!selectedSociety) return;
    
    try {
      const data = await getUtilityWorkers(selectedSociety);
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedSociety) {
      fetchWorkers();
    }
  }, [selectedSociety]);

  const handleStatusChange = async (requestId: string, status: string) => {
    setUpdatingId(requestId);
    try {
      await updateMaintenanceRequest(requestId, { status: status as any });
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: status as any } : req
      ));
      
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWorkerAssignment = async (requestId: string, workerId: string | null) => {
    setUpdatingId(requestId);
    try {
      await updateMaintenanceRequest(requestId, { assigned_worker_id: workerId });
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, assigned_worker_id: workerId } : req
      ));
      
      toast.success("Worker assigned successfully");
    } catch (error) {
      console.error("Error assigning worker:", error);
      toast.error("Failed to assign worker");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCostUpdate = async (requestId: string, costStr: string) => {
    const cost = costStr === "" ? null : parseFloat(costStr);
    if (costStr !== "" && isNaN(cost as number)) {
      toast.error("Cost must be a valid number");
      return;
    }
    
    setUpdatingId(requestId);
    try {
      await updateMaintenanceRequest(requestId, { cost });
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, cost } : req
      ));
      
      toast.success("Cost updated successfully");
    } catch (error) {
      console.error("Error updating cost:", error);
      toast.error("Failed to update cost");
    } finally {
      setUpdatingId(null);
    }
  };

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Maintenance Requests</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRequests}
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No maintenance requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.tenant_name || 'Unknown'}</TableCell>
                    <TableCell>{request.issue_type}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={request.status}
                        onValueChange={(value) => handleStatusChange(request.id, value)}
                        disabled={updatingId === request.id}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={request.assigned_worker_id || ""}
                        onValueChange={(value) => handleWorkerAssignment(request.id, value || null)}
                        disabled={updatingId === request.id || workers.length === 0}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Assign worker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Not assigned</SelectItem>
                          {workers.map((worker) => (
                            <SelectItem key={worker.id} value={worker.id}>
                              {worker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Cost"
                        className="w-[100px]"
                        defaultValue={request.cost?.toString() || ""}
                        onBlur={(e) => handleCostUpdate(request.id, e.target.value)}
                        disabled={updatingId === request.id}
                      />
                    </TableCell>
                    <TableCell>{format(new Date(request.created_at), 'PPP')}</TableCell>
                    <TableCell>
                      {updatingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => {}}>
                          Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
