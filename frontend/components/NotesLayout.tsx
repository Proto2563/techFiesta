"use client";

import { useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import NotesList from "./NotesList";
import NotesRenderer from "./NotesRenderer";
import Tools from "./Tools";
import { RagDoubtSolver } from "@/components/tools/RagDoubtSolver"; 
import QuizGenerator from "@/components/QuizGenerator";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NotesLayout() {
  const toolsPanelRef = useRef<any>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleToolsPanel = () => {
    if (!toolsPanelRef.current) return;

    if (isToolsOpen) {
      toolsPanelRef.current.collapse();
      setIsToolsOpen(false);
    } else {
      toolsPanelRef.current.expand();
      setIsToolsOpen(true);
    }
  };

  return (
    <div className="relative h-screen bg-neutral-950 overflow-hidden">
      <PanelGroup direction="horizontal" className="text-white h-full">
        
        {/* Left Panel: Notes List */}
        <Panel defaultSize={20} minSize={20} maxSize={30} className="border-r border-stone-800">
          <NotesList />
        </Panel>

        <PanelResizeHandle className="bg-stone-800 w-[2px]" />

        {/* Center Panel: Note Content + Overlay Tools */}
        <Panel minSize={50}>
          <div className="h-full w-full flex flex-col relative bg-neutral-900/50">
            
            {/* The Note Editor/Renderer */}
            {/* Added pb-20 to ensure content isn't hidden behind the collapsed tools */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-20 scroll-smooth">
               <NotesRenderer />
            </div>

            {/* Floating Overlay Container for Doubt Solver & Quiz */}
            {/* pointer-events-none ensures clicks pass through to the note in empty spaces */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col justify-end pointer-events-none">
              <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  
                  {/* Left: Doubt Solver */}
                  <div className="w-full pointer-events-auto transition-all duration-300">
                      <RagDoubtSolver />
                  </div>

                  {/* Right: Quiz Generator */}
                  <div className="w-full pointer-events-auto transition-all duration-300">
                      <QuizGenerator />
                  </div>

              </div>
            </div>

          </div>
        </Panel>

        {isToolsOpen && (
          <PanelResizeHandle className="bg-stone-800 w-[2px]" />
        )}

        {/* Right Panel: Tools (YouTube, PDF, etc.) */}
        <Panel
          defaultSize={4}
          minSize={15}
          collapsedSize={4}
          collapsible
          ref={toolsPanelRef}
          className="border-l border-stone-800 bg-neutral-950"
        >
          <Tools isCollapsed={!isToolsOpen} setCollapsed={toggleToolsPanel} />
        </Panel>

      </PanelGroup>
    </div>
  );
}