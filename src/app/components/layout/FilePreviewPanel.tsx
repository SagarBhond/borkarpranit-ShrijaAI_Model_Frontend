import { X, Eye, Download, Upload } from "lucide-react";
import { KNOWLEDGE_DOCS } from "../../constants/data";
import { FileIcon } from "../shared";

export const FilePreviewPanel = ({ onClose }: { onClose: () => void }) => (
  <div
    className="w-72 flex-shrink-0 border-l border-border flex flex-col bg-background"
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <span className="text-sm font-semibold text-foreground">Attachments</span>
      <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
        <X size={13} />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {KNOWLEDGE_DOCS.slice(0, 3).map(doc => (
        <div key={doc.id} className="p-3 rounded-xl border border-border hover:border-foreground/20 transition-all cursor-pointer bg-card">
          <div className="flex items-center gap-2.5 mb-2">
            <FileIcon type={doc.type} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.size}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{doc.uploaded}</span>
            <div className="flex gap-1">
              <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"><Eye size={11} /></button>
              <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"><Download size={11} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-3 border-t border-border">
      <button
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-muted-foreground border border-dashed border-border hover:border-foreground/40 hover:text-foreground transition-all"
      >
        <Upload size={14} />
        Upload File
      </button>
    </div>
  </div>
);
