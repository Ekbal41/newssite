import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { AlertTriangle, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReportModal = ({ articleId, onClose }: { articleId: string, onClose: () => void }) => {
    const [reason, setReason] = useState("INACCURATE");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();

    const handleSubmit = async () => {
        if (!user) {
            toast.error("You must be logged in to report an article");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post("/reports", { articleId, reason, details });
            toast.success("Report submitted");
            onClose();
        } catch (err) {
            toast.error("Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Report Article</DialogTitle>
                    <DialogDescription>Flag this article for review by our editorial team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INACCURATE">Inaccurate Information</SelectItem>
                                <SelectItem value="BIASED">Biased Language</SelectItem>
                                <SelectItem value="MISSING_CONTEXT">Missing Context</SelectItem>
                                <SelectItem value="PLAGIARISM">Plagiarism</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Details</Label>
                        <Textarea placeholder="Provide specific details or links..." value={details} onChange={(e) => setDetails(e.target.value)} required />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting || !details}>
                        <Send className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
