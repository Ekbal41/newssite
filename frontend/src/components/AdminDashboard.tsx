import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { Shield, AlertTriangle, CheckCircle, XCircle, Users, History } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AdminDashboard = () => {
    const queryClient = useQueryClient();

    const { data: logs, isLoading: logsLoading } = useQuery({
        queryKey: ["audit-logs"],
        queryFn: async () => { const res = await api.get("/system/logs"); return res.data.logs; }
    });

    const { data: reports, isLoading: reportsLoading } = useQuery({
        queryKey: ["reports"],
        queryFn: async () => { const res = await api.get("/reports"); return res.data.reports; }
    });

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => { const res = await api.get("/auth/users"); return res.data.users; }
    });

    const resolveReportMutation = useMutation({
        mutationFn: async ({ id, status }: any) => api.patch(`/reports/${id}`, { status }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reports"] }); toast.success("Report updated"); }
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: any) => api.patch("/auth/users/role", { userId, role }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Role updated"); }
    });

    const isLoading = logsLoading || reportsLoading || usersLoading;

    if (isLoading) {
        return <div className="space-y-4"><Skeleton className="h-12 w-64" /><Skeleton className="h-64 w-full" /></div>;
    }

    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-medium"><Shield className="h-4 w-4" /> Admin Suite</div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">System Oversight</h1>
                <p className="text-muted-foreground">Manage users, resolve reports, and view audit logs.</p>
            </header>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Reports ({reports?.length || 0})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    {reports?.length === 0 ? <p className="text-muted-foreground text-sm">No pending reports.</p> : (
                                        <div className="space-y-4">
                                            {reports?.map((r: any) => (
                                                <div key={r.id} className="p-4 border rounded-md space-y-2">
                                                    <p className="font-medium text-sm">{r.article?.headline || "Unknown Article"}</p>
                                                    <p className="text-xs text-muted-foreground"><span className="font-bold">{r.reason}:</span> {r.details}</p>
                                                    {r.status === "PENDING" && (
                                                        <div className="flex gap-2 pt-2">
                                                            <Button size="sm" variant="outline" onClick={() => resolveReportMutation.mutate({ id: r.id, status: "DISMISSED" })}><XCircle className="h-3 w-3 mr-1" /> Dismiss</Button>
                                                            <Button size="sm" onClick={() => resolveReportMutation.mutate({ id: r.id, status: "RESOLVED" })}><CheckCircle className="h-3 w-3 mr-1" /> Resolve</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><History className="h-4 w-4" /> Audit Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    {logs?.length === 0 ? <p className="text-muted-foreground text-sm">No audit logs.</p> : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow><TableHead>Action</TableHead><TableHead>User</TableHead><TableHead>Time</TableHead></TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {logs?.slice(0, 20).map((log: any) => (
                                                    <TableRow key={log.id}>
                                                        <TableCell className="text-sm">{log.action}</TableCell>
                                                        <TableCell className="text-sm">{log.user?.name || "System"}</TableCell>
                                                        <TableCell className="text-xs text-muted-foreground">{dayjs(log.createdAt).format("MMM D, HH:mm")}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> User Directory ({users?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead>Actions</TableHead></TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users?.map((user: any) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Select defaultValue={user.role} onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}>
                                                    <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="READER">Reader</SelectItem>
                                                        <SelectItem value="JOURNALIST">Journalist</SelectItem>
                                                        <SelectItem value="FACT_CHECKER">Fact Checker</SelectItem>
                                                        <SelectItem value="EDITOR">Editor</SelectItem>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{dayjs(user.createdAt).format("MMM D, YYYY")}</TableCell>
                                            <TableCell><Button variant="ghost" size="sm">Details</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
