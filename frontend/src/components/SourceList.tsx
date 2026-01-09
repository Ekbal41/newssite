import { Link as LinkIcon } from "lucide-react";

interface Source {
    id: string;
    name: string;
    url?: string;
    description?: string;
}

interface SourceListProps {
    sources: Source[];
}

export const SourceList = ({ sources }: SourceListProps) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div >
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Independent Sources</h3>
            <ul className="space-y-3">
                {sources.map((source) => (
                    <li key={source.id} className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-muted">
                            <LinkIcon className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground capitalize">{source.name || source.id}</span>
                                {source.url && (
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Visit Source
                                    </a>
                                )}
                            </div>
                            {source.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{source.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
