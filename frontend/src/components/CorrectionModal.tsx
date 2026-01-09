import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CorrectionModal = ({ article, onClose }: { article: any, onClose: () => void }) => {
    const [newHeadline, setNewHeadline] = useState(article.headline);
    const [newBody, setNewBody] = useState(article.body);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const handleSubmit = async () => {
        if (!newBody || newBody === "<p><br></p>") {
            toast.error("Article body cannot be empty");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post(`/articles/${article.id}/correction`, { reason, newHeadline, newBody });
            toast.success("Correction applied");
            onClose();
            window.location.reload();
        } catch (err) {
            toast.error("Failed to apply correction");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-serif flex items-center gap-2"><Edit3 className="h-5 w-5" /> Apply Correction</DialogTitle>
                    <DialogDescription>Modify the article and document the reason for the change.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4 space-y-4">
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for Correction</Label>
                            <Input placeholder="e.g., Corrected date of event" value={reason} onChange={(e) => setReason(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>New Headline</Label>
                            <Input className="font-serif text-lg" value={newHeadline} onChange={(e) => setNewHeadline(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>New Body</Label>
                            <div className="border rounded-md overflow-hidden">
                                <ReactQuill theme="snow" value={newBody} onChange={setNewBody} modules={quillModules} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Applying..." : "Apply Correction"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
