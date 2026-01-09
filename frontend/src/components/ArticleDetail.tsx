import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import api from "@/api/axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Flag,
  History,
  MapPin,
  Printer,
  Share2,
  User,
} from "lucide-react";

import { VerificationBadge } from "./VerificationBadge";
import { SourceList } from "./SourceList";
import { ReportModal } from "./ReportModal";

export function ArticleDetail() {
  const { id } = useParams();
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const res = await api.get(`/articles/${id}`);
      return res.data.article;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 space-y-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-3xl font-semibold mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-8">
          The requested article does not exist or has been removed.
        </p>
        <Link to="/news">
          <Button>Return to news</Button>
        </Link>
      </div>
    );
  }

  const sanitizedBody = DOMPurify.sanitize(article.body);
  const latestCorrection = article.corrections?.[0];

  return (
    <article className="max-w-5xl mx-auto px-4 py-20">
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
      >
        <ChevronLeft className="w-4 h-4" /> Back to news
      </Link>

      {latestCorrection && (
        <Card className="mb-12 border-amber-200 bg-amber-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium mb-2">
              <AlertCircle className="w-4 h-4" /> Correction
            </div>
            <p className="text-sm text-amber-900">
              This article was corrected on{" "}
              <span className="font-medium">
                {dayjs(latestCorrection.createdAt).format("MMMM D, YYYY")}
              </span>
              .
            </p>
          </CardContent>
        </Card>
      )}

      <header className="space-y-8 mb-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VerificationBadge status={article.status} />
            <Badge variant="secondary">{article.category}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReportModal(true)}
            >
              <Flag className="w-4 h-4 mr-2" /> Report
            </Button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          {article.headline}
        </h1>

        <Card>
          <CardContent className="py-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">
                {article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {article.location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {dayjs(article.publishedAt || article.createdAt).format(
                "MMMM D, YYYY"
              )}
            </div>
          </CardContent>
        </Card>
      </header>

      <div
        className="prose prose-xl md:prose-2xl prose-slate max-w-6xl font-serif leading-relaxed text-foreground/90 mb-24 article-content break-words"
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />

      <Separator className="my-16" />

      <section className="grid md:grid-cols-2 gap-12">
        <SourceList sources={article.sources} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4" /> Verification trail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {article.reviews?.length ? (
              article.reviews.map((review: any) => (
                <div key={review.id} className="space-y-1">
                  <p className="text-sm font-medium">
                    {review.type === "FACT_CHECK"
                      ? "Fact-check verified"
                      : "Editorial approval"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.reviewer.name} •{" "}
                    {dayjs(review.createdAt).format("MMM D, YYYY")}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground italic">
                      “{review.comment}”
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No verification records available.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {showReportModal && (
        <ReportModal
          articleId={article.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </article>
  );
}
