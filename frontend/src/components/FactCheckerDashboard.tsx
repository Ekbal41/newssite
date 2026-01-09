import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  User,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORIES = [
  "Politics",
  "Economy",
  "Health",
  "Education",
  "Environment",
  "National",
  "International",
];

export const FactCheckerDashboard = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["pending-articles", search, category, page],
    queryFn: async () => {
      const res = await api.get("/articles/pending/verification", {
        params: {
          search,
          category: category === "all" ? "" : category,
          page,
          limit: 10,
        },
      });
      return res.data;
    },
  });

  const articles = data?.articles || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, comment }: any) => {
      return api.post(`/articles/${id}/review`, { status, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-articles"] });
      toast.success("Review submitted successfully");
      setSelectedArticle(null);
      setComment("");
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });

  const handleReview = (status: string) => {
    if (!selectedArticle) return;
    reviewMutation.mutate({ id: selectedArticle.id, status, comment });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <ShieldCheck className="h-4 w-4" /> Fact-Checking Portal
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Verification Queue
        </h1>
        <p className="text-muted-foreground">
          Review pending reports for accuracy and bias.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search headlines..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              All caught up! No articles pending verification.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article: any) => (
            <Card
              key={article.id}
              className="hover:border-primary/30 transition-colors"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="badge bg-secondary text-secondary-foreground">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{" "}
                    {dayjs(article.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
                <CardTitle className="font-serif">{article.headline}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {article.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {article.location}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedArticle(article)}
                >
                  <Eye className="h-4 w-4 mr-2" /> Review
                </Button>
              </CardFooter>
            </Card>
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null);
        }}
      >
        <DialogContent className="flex flex-col !max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {selectedArticle?.headline}
            </DialogTitle>
            <DialogDescription>
              By {selectedArticle?.author.name} • {selectedArticle?.location} •{" "}
              {dayjs(selectedArticle?.createdAt).format("MMM D, YYYY")}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-4 h-[50vh]">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedArticle?.body || ""),
              }}
            />
            {selectedArticle?.sources?.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-bold text-sm mb-2">
                  Sources ({selectedArticle?.sources.length})
                </h4>
                <ul className="text-sm space-y-1">
                  {selectedArticle?.sources.map((s: any, i: number) => (
                    <li key={i}>
                      {s.name}{" "}
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          [link]
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ScrollArea>
          <div className="pt-4 border-t space-y-4">
            <Textarea
              placeholder="Verification notes (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <DialogFooter className="gap-4">
              <Button
                variant="outline"
                onClick={() => handleReview("REJECTED")}
                disabled={reviewMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </Button>
              <Button
                onClick={() => handleReview("APPROVED")}
                disabled={reviewMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Verify
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
