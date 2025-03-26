
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock service request data
const mockServiceRequests = [
  {
    id: "SRV-001",
    title: "Leaking Sink",
    property: "Sunset Apartments",
    unit: "101",
    tenant: "John Doe",
    priority: "high",
    status: "pending",
    dateSubmitted: "2023-06-15",
    description: "The sink in the bathroom is leaking and causing water damage.",
    assignedTo: "",
    notes: ""
  },
  {
    id: "SRV-002",
    title: "Air Conditioning Not Working",
    property: "Mountain View Condos",
    unit: "205",
    tenant: "Jane Smith",
    priority: "medium",
    status: "in-progress",
    dateSubmitted: "2023-06-20",
    description: "AC unit is not cooling properly, blowing warm air instead.",
    assignedTo: "Mike Technician",
    notes: "Parts ordered, scheduled for repair on Friday."
  },
  {
    id: "SRV-003",
    title: "Broken Window",
    property: "Garden Villas",
    unit: "302",
    tenant: "Robert Johnson",
    priority: "low",
    status: "completed",
    dateSubmitted: "2023-06-10",
    description: "Window in living room has a crack and needs to be replaced.",
    assignedTo: "Glass Repair Team",
    notes: "Window replaced on June 12th."
  },
  {
    id: "SRV-004",
    title: "Power Outage in Kitchen",
    property: "City Center Lofts",
    unit: "408",
    tenant: "Emily Wilson",
    priority: "high",
    status: "pending",
    dateSubmitted: "2023-06-22",
    description: "No power in kitchen outlets. Checked breaker but issue persists.",
    assignedTo: "",
    notes: ""
  },
];

// Mock staff data for assignment
const maintenanceStaff = [
  { id: "STAFF-001", name: "Mike Technician", specialty: "HVAC, Plumbing" },
  { id: "STAFF-002", name: "Sarah Electrician", specialty: "Electrical, Appliances" },
  { id: "STAFF-003", name: "Glass Repair Team", specialty: "Windows, Doors" },
  { id: "STAFF-004", name: "Alex Handyman", specialty: "General Repairs" },
];

export function ServiceManagement() {
  const [serviceRequests, setServiceRequests] = useState(mockServiceRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  const filteredRequests = serviceRequests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (request: any) => {
    setSelectedRequest(request);
    setUpdatedStatus(request.status);
    setAssignedTo(request.assignedTo);
    setNotes(request.notes);
    setIsUpdateDialogOpen(true);
  };

  const saveStatusUpdate = () => {
    const updatedRequests = serviceRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: updatedStatus,
          assignedTo,
          notes
        };
      }
      return request;
    });
    
    setServiceRequests(updatedRequests);
    setIsUpdateDialogOpen(false);
    toast.success("Service request updated successfully");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Service Requests</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8 max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="hidden md:table-cell">Tenant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {request.property}<br />
                          <span className="text-xs text-muted-foreground">Unit {request.unit}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{request.tenant}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(request.priority)}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status === "in-progress" 
                                ? "In Progress"
                                : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{request.dateSubmitted}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                                <Search className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(request)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No service requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Similar structure for other tabs with filtered data */}
          <TabsContent value="pending" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="hidden md:table-cell">Tenant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.filter(r => r.status === "pending").length > 0 ? (
                    filteredRequests
                      .filter(r => r.status === "pending")
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {request.property}<br />
                            <span className="text-xs text-muted-foreground">Unit {request.unit}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{request.tenant}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getPriorityColor(request.priority)}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <Badge variant="outline" className={getStatusColor(request.status)}>
                                Pending
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{request.dateSubmitted}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                                  <Search className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(request)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No pending service requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Similar structure for in-progress and completed tabs */}
          
        </Tabs>
      </CardContent>

      {/* View Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Service Request Details</DialogTitle>
              <DialogDescription>
                Service ID: {selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Title</h3>
                  <p>{selectedRequest.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Badge variant="outline" className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status === "in-progress" 
                      ? "In Progress"
                      : selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Property & Unit</h3>
                <p>{selectedRequest.property}, Unit {selectedRequest.unit}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Tenant</h3>
                <p>{selectedRequest.tenant}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Priority</h3>
                  <Badge variant="outline" className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Date Submitted</h3>
                  <p>{selectedRequest.dateSubmitted}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Assigned To</h3>
                <p>{selectedRequest.assignedTo || "Not assigned"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Service Notes</h3>
                <p className="text-sm">{selectedRequest.notes || "No notes available"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleUpdateStatus(selectedRequest)}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Status Dialog */}
      {selectedRequest && (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Service Request</DialogTitle>
              <DialogDescription>
                Update the status and details for service request {selectedRequest.id}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Request Title</Label>
                  <Input id="title" value={selectedRequest.title} disabled />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="property">Property & Unit</Label>
                <Input id="property" value={`${selectedRequest.property}, Unit ${selectedRequest.unit}`} disabled />
              </div>
              
              <div>
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {maintenanceStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name} ({staff.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Service Notes</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about the service progress, repairs made, etc."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveStatusUpdate}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
