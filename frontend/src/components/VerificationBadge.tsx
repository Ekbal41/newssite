import { CheckCircle2, ShieldCheck } from "lucide-react";

interface VerificationBadgeProps {
    status: string;
}

export const VerificationBadge = ({ status }: VerificationBadgeProps) => {
    if (status !== "PUBLISHED") return null;

    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verification Status: Fully Verified
        </div>
    );
};
