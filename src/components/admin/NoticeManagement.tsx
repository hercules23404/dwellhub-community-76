
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
import { Edit, Trash, Plus, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock notice data
const mockNotices = [
  {
    id: "NOT-001",
    title: "Building Maintenance Notice",
    category: "maintenance",
    target: "all",
    publishDate: "2023-06-01",
    expiryDate: "2023-07-01",
    status: "active",
    content: "We will be conducting maintenance on the building's water system on June 15th from 9 AM to 2 PM. Water service will be temporarily suspended during this time."
  },
  {
    id: "NOT-002",
    title: "Community Event: Summer BBQ",
    category: "event",
    target: "all",
    publishDate: "2023-06-10",
    expiryDate: "2023-06-25",
    status: "active",
    content: "Join us for our annual summer BBQ in the common area on June 24th from 4 PM to 8 PM. Food and drinks will be provided. Please RSVP by June 20th."
  },
  {
    id: "NOT-003",
    title: "Parking Lot Repainting",
    category: "maintenance",
    target: "Sunset Apartments",
    publishDate: "2023-05-20",
    expiryDate: "2023-06-05",
    status: "expired",
    content: "The parking lot will be repainted on June 3rd. Please remove all vehicles from the lot by 8 AM. The work should be completed by 5 PM the same day."
  },
  {
    id: "NOT-004",
    title: "Rent Increase Notice",
    category: "administrative",
    target: "Mountain View Condos",
    publishDate: "2023-06-15",
    expiryDate: "2023-08-15",
    status: "scheduled",
    content: "This notice is to inform you that there will be a 3% rent increase effective August 1st. This is in accordance with your lease agreement."
  },
];

// Mock property data for target selection
const properties = [
  { id: "PRO-101", name: "Sunset Apartments" },
  { id: "PRO-102", name: "Mountain View Condos" },
  { id: "PRO-103", name: "Garden Villas" },
  { id: "PRO-104", name: "City Center Lofts" },
];

export function NoticeManagement() {
  const [notices, setNotices] = useState(mockNotices);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "maintenance",
    target: "all",
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    content: "",
    status: "active"
  });

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNotice = () => {
    // Set status based on publish date
    const today = new Date().toISOString().split('T')[0];
    let status = "active";
    
    if (newNotice.publishDate > today) {
      status = "scheduled";
    }
    
    const notice = {
      ...newNotice,
      id: `NOT-${notices.length + 1}`.padStart(6, '0'),
      status
    };
    
    setNotices([...notices, notice]);
    setNewNotice({
      title: "",
      category: "maintenance",
      target: "all",
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: "",
      content: "",
      status: "active"
    });
    
    setShowAddDialog(false);
    toast.success("Notice added successfully");
  };

  const handleEditNotice = () => {
    const updatedNotices = notices.map(notice => {
      if (notice.id === selectedNotice.id) {
        return selectedNotice;
      }
      return notice;
    });
    
    setNotices(updatedNotices);
    setShowEditDialog(false);
    toast.success("Notice updated successfully");
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
    toast.success("Notice deleted successfully");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "administrative":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Notice Board Management</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search notices..."
              className="max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Notice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Notice</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new notice. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Notice Title</Label>
                    <Input 
                      id="title" 
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                      placeholder="Enter a descriptive title" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newNotice.category} 
                        onValueChange={(value) => setNewNotice({...newNotice, category: value})}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="administrative">Administrative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="target">Target Property</Label>
                      <Select 
                        value={newNotice.target} 
                        onValueChange={(value) => setNewNotice({...newNotice, target: value})}
                      >
                        <SelectTrigger id="target">
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          {properties.map(property => (
                            <SelectItem key={property.id} value={property.name}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input 
                        id="publishDate" 
                        type="date"
                        value={newNotice.publishDate}
                        onChange={(e) => setNewNotice({...newNotice, publishDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        type="date"
                        value={newNotice.expiryDate}
                        onChange={(e) => setNewNotice({...newNotice, expiryDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="content">Notice Content</Label>
                    <Textarea 
                      id="content" 
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                      placeholder="Enter the detailed content of the notice"
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNotice}>
                    Create Notice
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Target</TableHead>
                <TableHead className="hidden md:table-cell">Publish Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="font-medium">{notice.id}</TableCell>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(notice.category)}>
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{notice.target}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(notice.publishDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(notice.expiryDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(notice.status)}>
                        {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedNotice(notice);
                            setShowEditDialog(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteNotice(notice.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                    No notices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Notices About to Expire */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Expiring Soon</h3>
          <div className="rounded-md border bg-amber-50">
            {notices.filter(notice => {
              const today = new Date();
              const expiryDate = new Date(notice.expiryDate);
              const diffTime = expiryDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays > 0 && diffDays <= 7 && notice.status === "active";
            }).length > 0 ? (
              <div className="p-4">
                <div className="flex gap-2 items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium">The following notices will expire within 7 days:</h4>
                </div>
                <ul className="space-y-2 mt-2">
                  {notices.filter(notice => {
                    const today = new Date();
                    const expiryDate = new Date(notice.expiryDate);
                    const diffTime = expiryDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 && diffDays <= 7 && notice.status === "active";
                  }).map(notice => (
                    <li key={notice.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-medium">{notice.title}</span> 
                        <span className="text-sm text-muted-foreground ml-2">({notice.id})</span>
                        <p className="text-sm text-muted-foreground">Expires on {formatDate(notice.expiryDate)}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedNotice(notice);
                        setShowEditDialog(true);
                      }}>
                        Extend
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notices expiring soon
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Edit Notice Dialog */}
      {selectedNotice && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Notice</DialogTitle>
              <DialogDescription>
                Update the notice details. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Notice Title</Label>
                <Input 
                  id="edit-title" 
                  value={selectedNotice.title}
                  onChange={(e) => setSelectedNotice({...selectedNotice, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={selectedNotice.category} 
                    onValueChange={(value) => setSelectedNotice({...selectedNotice, category: value})}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-target">Target Property</Label>
                  <Select 
                    value={selectedNotice.target} 
                    onValueChange={(value) => setSelectedNotice({...selectedNotice, target: value})}
                  >
                    <SelectTrigger id="edit-target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.name}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-publishDate">Publish Date</Label>
                  <Input 
                    id="edit-publishDate" 
                    type="date"
                    value={selectedNotice.publishDate}
                    onChange={(e) => setSelectedNotice({...selectedNotice, publishDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                  <Input 
                    id="edit-expiryDate" 
                    type="date"
                    value={selectedNotice.expiryDate}
                    onChange={(e) => setSelectedNotice({...selectedNotice, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Notice Content</Label>
                <Textarea 
                  id="edit-content" 
                  value={selectedNotice.content}
                  onChange={(e) => setSelectedNotice({...selectedNotice, content: e.target.value})}
                  rows={5}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedNotice.status} 
                  onValueChange={(value) => setSelectedNotice({...selectedNotice, status: value})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditNotice}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
