import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import dayjs from "dayjs";
import { VerificationBadge } from "./VerificationBadge";
import { SourceList } from "./SourceList";
import { AlertCircle, History, User, MapPin, Calendar, Flag, Share2, Printer, ChevronLeft } from "lucide-react";
import { ReportModal } from "./ReportModal";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

export const ArticleDetail = () => {
    const { id } = useParams();
    const [showReportModal, setShowReportModal] = useState(false);

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const res = await api.get(`/articles/${id}`);
            return res.data.article;
        }
    });

    if (isLoading) return (
        <div className="max-w-6xl mx-auto py-16 space-y-12 animate-pulse">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-16 bg-muted rounded-2xl w-3/4"></div>
            <div className="h-8 bg-muted rounded-xl w-1/2"></div>
            <div className="h-96 bg-muted rounded-3xl w-full"></div>
        </div>
    );

    if (!article) return (
        <div className="max-w-6xl mx-auto py-16 text-center">
            <div className="p-4 bg-muted rounded-full inline-block mb-6">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground text-lg">The article you are looking for does not exist or has been removed.</p>
            <Link to="/" className="mt-8 inline-block btn-primary">Return to News Feed</Link>
        </div>
    );

    const latestCorrection = article.corrections?.[0];
    const sanitizedBody = DOMPurify.sanitize(article.body);

    return (
        <article className="max-w-6xl mx-auto px-4 py-8 md:py-16 md:py-24">
            <Link to="/news" className="inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs mb-12 transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to News Feed
            </Link>

            {/* Correction Notice */}
            {latestCorrection && (
                <div className="mb-16 p-8 bg-amber-50/50 border border-amber-200 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-amber-800 font-bold uppercase tracking-widest text-xs mb-4">
                        <AlertCircle className="w-5 h-5" /> Correction Notice
                    </div>
                    <p className="text-amber-900 text-lg leading-relaxed">
                        This article was corrected on <span className="font-medium">{dayjs(latestCorrection.createdAt).format("MMMM D, YYYY")}</span>.
                    </p>
                </div>
            )}

            {/* Header */}
            <header className="mb-16">
                <div className="flex flex-wrap justify-start md:justify-between items-center gap-4 mb-10">
                    <div className="flex gap-4"><VerificationBadge status={article.status} />
                        <span className="badge bg-primary/5 text-primary">
                            {article.category}
                        </span></div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="Share">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="Print" onClick={() => window.print()}>
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-4 py-2.5 rounded-xl transition-all border border-border ml-2"
                        >
                            <Flag className="w-4 h-4" /> Report
                        </button>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-[1.05] mb-12 tracking-tight">
                    {article.headline}
                </h1>

                <div className="flex flex-wrap items-center gap-y-6 gap-x-12 text-sm font-bold text-muted-foreground border border-border py-4 bg-secondary/50 px-4 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-foreground leading-none mb-1">{article.author.name}</p>
                            <p className="text-[10px] opacity-60">Verified Journalist</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{article.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>{dayjs(article.publishedAt || article.createdAt).format("MMMM D, YYYY")}</span>
                    </div>
                </div>
            </header>

            {/* Body */}
            <div
                className="prose prose-xl md:prose-2xl prose-slate max-w-6xl font-serif leading-relaxed text-foreground/90 mb-24 article-content break-words"
                dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            {/* Transparency Section */}
            <section >
                <div className="grid md:grid-cols-2 gap-12">
                    <SourceList sources={article.sources} />
                    {/* Verification Trail */}
                    <div className="premium-card">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-10 flex items-center gap-3">
                            <History className="w-5 h-5 text-primary" /> Verification Trail
                        </h3>
                        <div className="space-y-6 relative">
                            {article.reviews?.map((review: any) => (
                                <div
                                    key={review.id}
                                    className="relative pl-12
        before:absolute
        before:left-[11px]
        before:top-8
        before:bottom-[-2.5rem]
        before:w-0.5
        before:bg-border
        last:before:hidden"
                                >
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">
                                            {review.type === "FACT_CHECK"
                                                ? "Fact-Check Verified"
                                                : "Editorial Approved"}
                                        </div>

                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                                            By {review.reviewer.name} •{" "}
                                            {dayjs(review.createdAt).format("MMM D, YYYY")}
                                        </div>

                                        {review.comment && (
                                            <p className="text-base text-muted-foreground mt-4 italic bg-muted/20 px-3 border-l-4 border-primary/20 leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {article.reviews?.length === 0 && (
                                <div className="pl-12 py-4">
                                    <p className="text-sm text-muted-foreground italic">
                                        No verification trail available for this article.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {showReportModal && (
                <ReportModal
                    articleId={article.id}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </article>
    );
};
