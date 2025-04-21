
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePlus, List, ArrowDown, Check, X } from "lucide-react";

type Status = "Pending" | "Completed";

type Request = {
  id: number;
  title: string;
  description: string;
  status: Status;
};

const initialRequests: Request[] = [
  {
    id: 1,
    title: "Power outage in Flat 302",
    description: "There has been no electricity since midnight.",
    status: "Pending",
  },
  {
    id: 2,
    title: "Leaky tap in kitchen",
    description: "The tap has been dripping constantly for a week.",
    status: "Completed",
  },
];

function getStatusBadge(status: Status) {
  if (status === "Pending")
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
        <ArrowDown size={14} className="inline-block" />
        Pending
      </Badge>
    );
  if (status === "Completed")
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <Check size={14} className="inline-block" />
        Completed
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
      <X size={14} className="inline-block" />
      Unknown
    </Badge>
  );
}

export default function TenantServiceRequests() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3 || description.trim().length < 3) return;

    setSubmitting(true);
    setTimeout(() => {
      setRequests([
        {
          id: Date.now(),
          title: title.trim(),
          description: description.trim(),
          status: "Pending",
        },
        ...requests,
      ]);
      setTitle("");
      setDescription("");
      setSubmitting(false);
    }, 600); // Simulate network delay
  };

  return (
    <div className="space-y-10 max-w-xl mx-auto w-full">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <FilePlus className="text-purple-600" />
          <CardTitle className="text-lg font-bold">
            Submit New Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g. Plumbing Issue"
                required
                minLength={3}
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in detail"
                required
                minLength={3}
                disabled={submitting}
                className="resize-vertical"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-purple-700">
          <List className="text-purple-400" />
          Submitted Requests
        </h2>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-gray-400 text-center">No requests found</div>
          ) : (
            requests.map(r => (
              <Card key={r.id} className="border-l-4 border-purple-300 shadow-none">
                <CardContent className="pt-4 pb-3 flex flex-col gap-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold">{r.title}</span>
                    {getStatusBadge(r.status)}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">{r.description}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
