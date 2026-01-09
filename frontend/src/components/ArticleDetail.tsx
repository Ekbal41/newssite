import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import api from "@/api/axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ExternalLink,
  Flag,
  Globe,
  Link2,
  MapPin,
  Printer,
  Share2,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";

import { VerificationBadge } from "./VerificationBadge";
import { ReportModal } from "./ReportModal";
import Navbar from "./layouts/RootNavbar";

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
      <div className="container mx-auto px-4 space-y-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 text-center">
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
    <div className="space-y-8 pb-12">
      <Navbar />
      <article className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
        >
          <ChevronLeft className="w-4 h-4" /> Back to news
        </Link>
        {latestCorrection && (
          <Card className="mb-12 border-amber-200 bg-amber-50">
            <CardContent>
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
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.print()}
              >
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
          className="prose prose-xl md:prose-2xl prose-slate max-w-full font-serif leading-relaxed text-foreground/90 mb-24 article-content break-words"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />

        <section className="space-y-8">
          {/* ================= Verification Trail ================= */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verification Trail
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {article.reviews?.length ? (
                article.reviews.map((review: any) => (
                  <Card key={review.id} className="bg-muted/30 shadow-none">
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                          {review.type === "FACT_CHECK" ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {review.type === "FACT_CHECK"
                              ? "Fact-check completed"
                              : "Editorial approval"}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {review.reviewer.name} •{" "}
                            {dayjs(review.createdAt).format("MMM D, YYYY")}
                          </p>

                          {review.comment && (
                            <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed">
                              “{review.comment}”
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No verification records available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ================= Sources ================= */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-4 w-4 text-primary" />
                Sources
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {article.sources.map((source: any) => (
                <Card key={source.id} className="bg-muted/30 shadow-none">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {source.name || source.id}
                          </span>

                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit
                            </a>
                          )}
                        </div>

                        {source.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {source.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
    </div>
  );
}
