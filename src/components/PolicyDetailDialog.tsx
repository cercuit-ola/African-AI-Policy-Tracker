import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Policy } from "@/hooks/usePolicies";
import StatusBadge from "./StatusBadge";

interface Props {
  policy: Policy | null;
  onClose: () => void;
}

export default function PolicyDetailDialog({ policy, onClose }: Props) {
  if (!policy) return null;

  return (
    <Dialog open={!!policy} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg leading-snug pr-6">{policy.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg">{policy.flag}</span>
            <span className="font-medium text-foreground">{policy.country}</span>
            {policy.region && (
              <span className="text-muted-foreground">· {policy.region}</span>
            )}
            <StatusBadge status={policy.status} />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Author</div>
            <div className="text-foreground">{policy.author}</div>
          </div>

          {policy.summary && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Summary</div>
              <p className="text-foreground leading-relaxed">{policy.summary}</p>
            </div>
          )}

          <div className="flex gap-6 text-xs text-muted-foreground">
            <div>
              <span className="block mb-0.5">Type</span>
              <span className="px-2 py-0.5 rounded bg-badge text-badge-foreground border border-badge-border">
                {policy.type}
              </span>
            </div>
            <div>
              <span className="block mb-0.5">Published</span>
              <span className="text-foreground">
                {policy.published_at
                  ? new Date(policy.published_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          {policy.source_url && (
            <a
              href={policy.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-primary hover:underline"
            >
              View source ↗
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
