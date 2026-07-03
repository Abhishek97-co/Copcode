import { useState, useRef, useEffect, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { X, Save } from "lucide-react";
import { getFileIcon, getFileIconColor } from "../utils/fileIcons";
import { MONACO_THEME, EDITOR_OPTIONS, getMonacoLanguage } from "./editorShared.js";

//Tab Bar
function TabBar({ tabs, activeFile, onSwitchTab, onCloseTab }) {
  if (!tabs.length) return null;
  return (
    <div className="flex items-end bg-[#161b22] border-b border-[#30363d] overflow-x-auto flex-shrink-0 h-9">
      {tabs.map((tab) => {
        const isActive = activeFile?.path === tab.path;
        return (
          <div
            key={tab.path}
            onClick={() => onSwitchTab(tab)}
            className={`flex items-center gap-1.5 px-3 h-full min-w-0 max-w-[160px] border-r border-[#30363d] cursor-pointer flex-shrink-0 group transition-colors select-none ${
              isActive ? "bg-[#0d1117] text-white" : "bg-[#161b22] text-gray-400 hover:bg-[#1c2333]"
            }`}
            style={{ borderTop: isActive ? "1px solid #22d3ee" : "1px solid transparent" }}
          >
            {tab.unsaved
              ? <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              : <span className="font-mono text-[9px] font-bold flex-shrink-0" style={{ color: getFileIconColor(tab.name) }}>{getFileIcon(tab.name)}</span>
            }
            <span className="font-mono text-[11px] truncate">{tab.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab); }}
              className="flex-shrink-0 ml-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
            ><X size={10} /></button>
          </div>
        );
      })}
    </div>
  );
}

export default function MainEditor({
  activeFile, tabs, onCloseTab, onSwitchTab,
  autoSave, socket, roomId, contentRef,
}) {
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());
  const [editorReady, setEditorReady]   = useState(false);

  const editorRef      = useRef(null);
  const monacoRef      = useRef(null);
  const bindingRef     = useRef(null);
  const ydocRef        = useRef(null);
  const ytextRef       = useRef(null);
  const activePathRef  = useRef(null);
  const autoSaveTimer  = useRef(null);

  useEffect(() => {
    if (!contentRef) return;
    contentRef.current = () => {
      const ytext = ytextRef.current;
      if (ytext) {
        try { return ytext.toString(); } catch { }
      }
      const editor = editorRef.current;
      if (editor && typeof editor.getValue === "function") {
        try { return editor.getValue() || ""; } catch { }
      }
      return activeFile?.content || "";
    };
  }, []);

  const buildTeardown = useCallback((
    ydoc, binding, socket, handlers
  ) => {
    let cleaned = false;
    return () => {
      if (cleaned) return;
      cleaned = true;
      
      if (socket && handlers) {
        const { step1Reply, step2Request, update, overwrite } = handlers;
        try { socket.off("editor:sync-step1-reply",   step1Reply);   } catch { /* ignore */ }
        try { socket.off("editor:sync-step2-request", step2Request); } catch { /* ignore */ }
        try { socket.off("editor:update",             update);       } catch { /* ignore */ }
        try { socket.off("editor:overwrite",          overwrite);    } catch { /* ignore */ }
      }
      
      if (ydoc && handlers?.yjsUpdate) {
        try { ydoc.off("update", handlers.yjsUpdate); } catch {  }
      }
      
      if (binding) {
        try { binding.destroy(); } catch {  }
      }
      
      if (ydoc) {
        try { ydoc.destroy(); } catch {  }
      }
     
      ytextRef.current = null;
      ydocRef.current  = null;
    };
  }, []);

  
  const setupYjs = useCallback((file) => {
    if (!file || !editorRef.current || !monacoRef.current) return null;

    activePathRef.current = file.path;

    const model = editorRef.current?.getModel?.();
    if (!model) return null;

    const ydoc  = new Y.Doc();
    const ytext = ydoc.getText("content");
    ydocRef.current  = ydoc;
    ytextRef.current = ytext;

    
    monacoRef.current.editor.setModelLanguage(
      model,
      getMonacoLanguage(file.name)
    );

    
    model.setValue("");

   
    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editorRef.current]),
      null
    );
    bindingRef.current = binding;

    
    if (!socket || !roomId) {
      if (file.content) ytext.insert(0, file.content);
      return buildTeardown(ydoc, binding, null, null);
    }

    
    const sv = Y.encodeStateVector(ydoc);
    socket.emit("editor:sync-step1", {
      roomId,
      filePath: file.path,
      stateVector: Array.from(sv), 
    });

    
    const filePath = file.path; 

    const step1Reply = ({ filePath: fp, update }) => {
      if (fp !== activePathRef.current) return;
      if (!update?.length) return;
     
      Y.applyUpdate(ydoc, new Uint8Array(update));
    };

    const step2Request = ({ filePath: fp, stateVector }) => {
      if (fp !== activePathRef.current) return;
      if (!stateVector?.length) return;
      const serverSV = new Uint8Array(stateVector);
      const missing  = Y.encodeStateAsUpdate(ydoc, serverSV);
      
      if (missing.length > 2) {
        socket.emit("editor:sync-step2", {
          roomId,
          filePath: fp,
          update: Array.from(missing), 
        });
      }
    };

    const update = ({ filePath: fp, update: upd }) => {
      if (fp !== activePathRef.current) return;
      if (!upd?.length) return;
     
      Y.applyUpdate(ydoc, new Uint8Array(upd), "remote");
    };

  
    const overwrite = ({ filePath: fp, update: upd, content: snapshot }) => {
      if (fp !== activePathRef.current) return;
      const ytext = ydoc.getText("content");

      let text = typeof snapshot === "string" ? snapshot : null;
      if (text === null && upd?.length) {
        const probe = new Y.Doc();
        try {
          Y.applyUpdate(probe, new Uint8Array(upd));
          text = probe.getText("content").toString();
        } finally {
          probe.destroy();
        }
      }
      if (text === null) return;

      Y.transact(ydoc, () => {
        if (ytext.length > 0) ytext.delete(0, ytext.length);
        if (text.length > 0) ytext.insert(0, text);
      }, "overwrite");
    };

    const yjsUpdate = (upd, origin) => {
     
      if (origin === "remote" || origin === "overwrite") return;

     
      socket.emit("editor:update", {
        roomId,
        filePath,
        update: Array.from(upd), 
      });

      setUnsavedFiles((prev) => new Set(prev).add(filePath));

      if (autoSave) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
          socket.emit("editor:save", { roomId, filePath });
          setUnsavedFiles((prev) => {
            const n = new Set(prev);
            n.delete(filePath);
            return n;
          });
        }, 600);
      }
    };

    
    socket.on("editor:sync-step1-reply",   step1Reply);
    socket.on("editor:sync-step2-request", step2Request);
    socket.on("editor:update",             update);
    socket.on("editor:overwrite",          overwrite);
    ydoc.on("update", yjsUpdate);

   
    return buildTeardown(ydoc, binding, socket, {
      step1Reply,
      step2Request,
      update,
      overwrite,
      yjsUpdate,
    });

  }, [socket, roomId, autoSave, buildTeardown]);

 
  const handleWillMount = (monaco) => {
    monaco.editor.defineTheme("copcode-dark", MONACO_THEME);
    monacoRef.current = monaco;
  };

  const handleDidMount = (editor) => {
    editorRef.current = editor;

    editor.addCommand(
      monacoRef.current?.KeyMod.CtrlCmd | monacoRef.current?.KeyCode.KeyS,
      () => {
        const path = activePathRef.current;
        if (path && socket && roomId) {
          socket.emit("editor:save", { roomId, filePath: path });
          setUnsavedFiles((prev) => { const n = new Set(prev); n.delete(path); return n; });
        }
      }
    );

    setEditorReady(true);
  };

  useEffect(() => {
    if (activeFile) return;
   
    queueMicrotask(() => {
      setEditorReady(false);
      editorRef.current = null;
      monacoRef.current = null;
    });
  }, [activeFile]);

  
  useEffect(() => {
    if (!editorReady || !activeFile) return;

    const cleanup = setupYjs(activeFile);

    
    return () => {
      clearTimeout(autoSaveTimer.current);
      if (typeof cleanup === "function") cleanup();
     
      ytextRef.current    = null;
      ydocRef.current     = null;
      bindingRef.current  = null;
      activePathRef.current = null;
    };
  }, [activeFile?.path, editorReady, setupYjs]);

  const tabsWithState = tabs.map((t) => ({
    ...t, unsaved: unsavedFiles.has(t.path),
  }));

  return (
    <div className="flex flex-col h-full bg-[#0d1117] overflow-hidden">

     
      <div className="flex items-center justify-between px-3 h-6 bg-[#161b22] border-b border-[#30363d] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="font-mono text-[9px] text-cyan-400 tracking-widest">MAIN EDITOR</span>
          <span className="font-mono text-[9px] text-gray-600">— shared · visible to all</span>
        </div>
        {activeFile && (
          <div className="flex items-center gap-3">
            {unsavedFiles.has(activeFile.path) && (
              <span className="font-mono text-[9px] text-amber-400">● unsaved</span>
            )}
            <span className="font-mono text-[9px] text-gray-600 capitalize">
              {getMonacoLanguage(activeFile.name)} · UTF-8
            </span>
            {!autoSave && (
              <button
                onClick={() => {
                  const path = activePathRef.current;
                  if (path && socket && roomId) {
                    socket.emit("editor:save", { roomId, filePath: path });
                    setUnsavedFiles((prev) => { const n = new Set(prev); n.delete(path); return n; });
                  }
                }}
                className="text-gray-500 hover:text-cyan-400 transition-colors"
                title="Save (Ctrl+S)"
              >
                <Save size={10} />
              </button>
            )}
          </div>
        )}
      </div>

     
      <TabBar
        tabs={tabsWithState}
        activeFile={activeFile}
        onSwitchTab={onSwitchTab}
        onCloseTab={onCloseTab}
      />

      
      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            defaultValue=""
            theme="copcode-dark"
            options={EDITOR_OPTIONS}
            beforeMount={handleWillMount}
            onMount={handleDidMount}
            loading={
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-xs text-cyan-400">Loading editor...</span>
                </div>
              </div>
            }
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center select-none bg-[#0d1117]">
      <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-4">
        <span className="font-mono text-xl text-gray-700">&lt;/&gt;</span>
      </div>
      <p className="font-mono text-xs text-gray-600 mb-1">No file open</p>
      <p className="font-mono text-[10px] text-gray-700">Select a file from the sidebar</p>
      <div className="mt-4 text-[10px] font-mono text-gray-700 space-y-1">
        <p>Ctrl+S — Save</p>
        <p>Ctrl+Enter — Run in terminal</p>
      </div>
    </div>
  );
}
