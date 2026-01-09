import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { VerificationBadge } from "./VerificationBadge";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Search, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Politics", "Economy", "Health", "Education", "Environment", "National", "International"];

export const NewsFeed = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["articles", debouncedSearch, category, page],
        queryFn: async () => {
            const res = await api.get("/articles", {
                params: { search: debouncedSearch, category: category === "all" ? "" : category, page, limit: 5 }
            });
            return res.data;
        }
    });

    const articles = data?.articles || [];
    const pagination = data?.pagination || { totalPages: 1 };

    return (
        <div className="space-y-8 max-w-6xl px-4 mx-auto md:py-16 py-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Latest News</h1>
                <p className="text-muted-foreground">Verified, transparent journalism you can trust.</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search headlines..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardHeader className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-8 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                    <CardContent>
                        <Search className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No articles found.</p>
                        <Button variant="link" onClick={() => { setSearch(""); setCategory("all"); }} className="mt-2">
                            Clear filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {articles.map((article: any) => (
                        <Card key={article.id} className="hover:border-primary/30 transition-colors">
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                                    <span className="badge bg-secondary text-secondary-foreground">{article.category}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {dayjs(article.publishedAt).format("MMM D, YYYY")}
                                    </span>
                                    <VerificationBadge status={article.status} />
                                </div>
                                <Link to={`/article/${article.id}`}>
                                    <h2 className="text-2xl font-serif font-bold hover:text-primary transition-colors leading-tight">
                                        {article.headline}
                                    </h2>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-muted-foreground line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: article.body }}
                                />
                            </CardContent>
                            <CardFooter className="justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{article.author.name}</span>
                                </div>
                                <Link to={`/article/${article.id}`}>
                                    <Button variant="link" className="p-0 h-auto font-semibold">
                                        Read more →
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
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
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
