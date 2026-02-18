import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/style";

interface SortableItemContextValue {
    attributes: Record<string, any>;
    listeners: Record<string, any> | undefined;
    isDragging: boolean;
}

const SortableItemContext = createContext<SortableItemContextValue | null>(null);

export function useSortableItem() {
    const context = useContext(SortableItemContext);
    if (!context) {
        throw new Error("useSortableItem must be used within a SortableItem");
    }
    return context;
}

interface SortableItemProps {
	id: string;
	children: ReactNode;
	className?: string;
    asHandle?: boolean;
}

export function SortableItem({ id, children, className, asHandle = false }: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
        position: "relative" as const,
	};

    const dragListeners = useMemo(() => {
        if (!listeners || !asHandle) return listeners;
        
        const wrappedListeners = { ...listeners };
        for (const key in wrappedListeners) {
            const originalListener = (wrappedListeners as any)[key];
            (wrappedListeners as any)[key] = (event: React.SyntheticEvent) => {
                event.stopPropagation();
                return originalListener?.(event);
            };
        }
        return wrappedListeners;
    }, [listeners, asHandle]);

    const contextValue = useMemo(() => ({
        attributes,
        listeners: dragListeners,
        isDragging
    }), [attributes, dragListeners, isDragging]);

	return (
        <SortableItemContext.Provider value={contextValue}>
            <div
                ref={setNodeRef}
                style={style}
                className={cn(className, isDragging && "opacity-50 z-50", asHandle && "cursor-grab active:cursor-grabbing")}
                {...(asHandle ? attributes : {})}
                {...(asHandle ? dragListeners : {})}
            >
                {children}
            </div>
        </SortableItemContext.Provider>
	);
}

export function DragHandle({ className, children }: { className?: string; children?: ReactNode }) {
    const { attributes, listeners } = useSortableItem();
    
    return (
        <button 
            type="button" 
            className={cn("touch-none cursor-grab active:cursor-grabbing flex items-center justify-center", className)} 
            {...attributes} 
            {...listeners}
        >
            {children || <DotsSixVerticalIcon size={16} className="text-gray-400" />}
        </button>
    );
}



