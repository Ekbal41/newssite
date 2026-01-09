import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit3, Search, ChevronLeft, ChevronRight, Eye, Calendar, User, MapPin, Newspaper } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import { CorrectionModal } from "./CorrectionModal";
import DOMPurify from "dompurify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORIES = ["Politics", "Economy", "Health", "Education", "Environment", "National", "International"];

export const EditorDashboard = () => {
    const [selectedArticleForCorrection, setSelectedArticleForCorrection] = useState<any>(null);
    const [viewingArticle, setViewingArticle] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["pending-editorial", search, category, page],
        queryFn: async () => {
            const res = await api.get("/articles/pending/verification", {
                params: { search, category: category === "all" ? "" : category, page, limit: 10 }
            });
            return res.data;
        }
    });

    const articles = data?.articles || [];
    const pagination = data?.pagination || { totalPages: 1 };

    const reviewMutation = useMutation({
        mutationFn: async ({ id, status, comment }: any) => {
            return api.post(`/articles/${id}/review`, { status, comment });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending-editorial"] });
            toast.success("Article status updated");
            setViewingArticle(null);
            setComment("");
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    const handleReview = (status: string) => {
        if (!viewingArticle) return;
        reviewMutation.mutate({ id: viewingArticle.id, status, comment });
    };

    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <Newspaper className="h-4 w-4" /> Editorial Desk
                </div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">Publication Queue</h1>
                <p className="text-muted-foreground">Final review before publication.</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader></Card>)}</div>
            ) : articles.length === 0 ? (
                <Card className="text-center py-12 border-dashed"><CardContent><CheckCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" /><p className="text-muted-foreground">No articles pending editorial review.</p></CardContent></Card>
            ) : (
                <div className="space-y-4">
                    {articles.map((article: any) => (
                        <Card key={article.id} className="hover:border-primary/30 transition-colors">
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <span className="badge bg-secondary text-secondary-foreground">{article.category}</span>
                                    <span className="badge badge-verified">Verified</span>
                                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dayjs(article.createdAt).format("MMM D, YYYY")}</span>
                                </div>
                                <CardTitle className="font-serif">{article.headline}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {article.author.name}</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {article.location}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button variant="outline" onClick={() => setViewingArticle(article)}><Eye className="h-4 w-4 mr-2" /> Review</Button>
                                <Button variant="ghost" onClick={() => setSelectedArticleForCorrection(article)}><Edit3 className="h-4 w-4 mr-2" /> Correct</Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm text-muted-foreground px-4">Page {page} of {pagination.totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
                </div>
            )}

            {selectedArticleForCorrection && <CorrectionModal article={selectedArticleForCorrection} onClose={() => setSelectedArticleForCorrection(null)} />}

            <Dialog open={!!viewingArticle} onOpenChange={(open) => { if (!open) setViewingArticle(null); }}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">{viewingArticle?.headline}</DialogTitle>
                        <DialogDescription>By {viewingArticle?.author.name} • {viewingArticle?.location}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-4">
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(viewingArticle?.body || "") }} />
                    </ScrollArea>
                    <div className="pt-4 border-t space-y-4">
                        <Textarea placeholder="Editorial notes (optional)..." value={comment} onChange={(e) => setComment(e.target.value)} />
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => handleReview("REJECTED")} disabled={reviewMutation.isPending}><XCircle className="h-4 w-4 mr-2" /> Reject</Button>
                            <Button onClick={() => handleReview("APPROVED")} disabled={reviewMutation.isPending}><CheckCircle className="h-4 w-4 mr-2" /> Publish</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
