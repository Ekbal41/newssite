import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "@/api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Link as LinkIcon, FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import dayjs from "dayjs";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Politics", "Economy", "Health", "Education", "Environment", "National", "International"];

export const JournalistDashboard = () => {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            headline: "",
            category: "National",
            location: "",
            body: ""
        }
    });
    const [sources, setSources] = useState([{ name: "", url: "", description: "" }]);
    const [evidence, setEvidence] = useState([{ type: "LINK", url: "", description: "" }]);
    const [myArticles, setMyArticles] = useState<any[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const navigate = useNavigate();

    const bodyContent = watch("body");

    const fetchMyArticles = async (page = 1) => {
        try {
            setLoadingArticles(true);
            const res = await api.get("/articles/my-articles", { params: { page, limit: 5 } });
            setMyArticles(res.data.articles || []);
            setPagination(res.data.pagination || { page: 1, totalPages: 1 });
        } catch (err) {
            // Silent fail
        } finally {
            setLoadingArticles(false);
        }
    };

    useEffect(() => {
        fetchMyArticles();
    }, []);

    const onSubmit = async (data: any) => {
        if (!data.body || data.body === "<p><br></p>") {
            toast.error("Article body cannot be empty");
            return;
        }
        try {
            const payload = { ...data, sources, evidence };
            await api.post("/articles", payload);
            toast.success("Article submitted for verification");
            reset();
            setSources([{ name: "", url: "", description: "" }]);
            setEvidence([{ type: "LINK", url: "", description: "" }]);
            fetchMyArticles();
        } catch (err) {
            toast.error("Failed to submit article");
        }
    };

    const addSource = () => setSources([...sources, { name: "", url: "", description: "" }]);
    const removeSource = (index: number) => setSources(sources.filter((_, i) => i !== index));

    const addEvidence = () => setEvidence([...evidence, { type: "LINK", url: "", description: "" }]);
    const removeEvidence = (index: number) => setEvidence(evidence.filter((_, i) => i !== index));

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="space-y-12">
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Create New Report</h1>
                    <p className="text-muted-foreground">Submit your findings for verification.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Article Details</CardTitle>
                            <CardDescription>Provide the core information for your story.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="headline">Headline</Label>
                                <Input
                                    id="headline"
                                    {...register("headline", { required: true })}
                                    placeholder="The core truth of your story..."
                                    className="text-lg font-serif"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select defaultValue="National" onValueChange={(val) => setValue("category", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            {...register("location", { required: true })}
                                            placeholder="e.g., Dhaka, Sylhet"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Article Body</Label>
                                <div className="border rounded-md overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={bodyContent}
                                        onChange={(content) => setValue("body", content)}
                                        modules={quillModules}
                                        placeholder="Write your article in neutral language..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Sources</CardTitle>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addSource}>
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sources.map((source, index) => (
                                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                                        {sources.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSource(index)}>
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        )}
                                        <Input
                                            placeholder="Source Name"
                                            value={source.name}
                                            onChange={(e) => {
                                                const newSources = [...sources];
                                                newSources[index].name = e.target.value;
                                                setSources(newSources);
                                            }}
                                        />
                                        <Input
                                            placeholder="Source URL"
                                            value={source.url}
                                            onChange={(e) => {
                                                const newSources = [...sources];
                                                newSources[index].url = e.target.value;
                                                setSources(newSources);
                                            }}
                                        />
                                        <Textarea
                                            placeholder="How was this source verified?"
                                            value={source.description}
                                            onChange={(e) => {
                                                const newSources = [...sources];
                                                newSources[index].description = e.target.value;
                                                setSources(newSources);
                                            }}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Evidence</CardTitle>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addEvidence}>
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {evidence.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-start p-4 border rounded-md relative">
                                        {evidence.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeEvidence(index)}>
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        )}
                                        <Select defaultValue={item.type} onValueChange={(val) => {
                                            const newEvidence = [...evidence];
                                            newEvidence[index].type = val;
                                            setEvidence(newEvidence);
                                        }}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LINK">Link</SelectItem>
                                                <SelectItem value="IMAGE">Image</SelectItem>
                                                <SelectItem value="DOCUMENT">Doc</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            className="flex-1"
                                            placeholder="Evidence URL"
                                            value={item.url}
                                            onChange={(e) => {
                                                const newEvidence = [...evidence];
                                                newEvidence[index].url = e.target.value;
                                                setEvidence(newEvidence);
                                            }}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end w-full">
                        <Button type="submit" size="lg" className="w-full md:w-fit">
                            Submit for Verification
                        </Button>
                    </div>
                </form>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-serif font-bold">My Submissions</h2>
                        <p className="text-muted-foreground text-sm">Track your reported stories.</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => fetchMyArticles(pagination.page)}>
                        Refresh
                    </Button>
                </div>

                {loadingArticles ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i}>
                                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                <CardFooter><Skeleton className="h-4 w-1/4" /></CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : myArticles.length === 0 ? (
                    <Card className="text-center py-12 border-dashed">
                        <CardContent>
                            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">You haven't submitted any articles yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {myArticles.map((article) => (
                            <Card key={article.id} className="hover:border-primary/30 transition-colors">
                                <CardHeader>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="badge bg-secondary text-secondary-foreground">{article.category}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {dayjs(article.createdAt).format("MMM D, YYYY")}
                                        </span>
                                    </div>
                                    <CardTitle className="font-serif text-xl">{article.headline}</CardTitle>
                                </CardHeader>
                                <CardFooter className="justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        {article.status === "PUBLISHED" ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Published</span>
                                        ) : article.status === "REJECTED" ? (
                                            <span className="text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Rejected</span>
                                        ) : (
                                            <span className="text-amber-600 flex items-center gap-1"><Clock className="h-4 w-4" /> {article.status.replace("_", " ")}</span>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/article/${article.id}`)}>
                                        View <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}

                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <Button variant="outline" size="icon" onClick={() => fetchMyArticles(pagination.page - 1)} disabled={pagination.page === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">Page {pagination.page} of {pagination.totalPages}</span>
                                <Button variant="outline" size="icon" onClick={() => fetchMyArticles(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};
