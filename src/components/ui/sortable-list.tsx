
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
    defaultDropAnimation,
    type DropAnimation,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface SortableListProps<T> {
	items: T[];
	onReorder: (items: T[]) => void;
	renderItem: (item: T) => ReactNode;
    renderOverlay?: (item: T) => ReactNode;
	keyExtractor: (item: T) => string;
    className?: string;
}

const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
};

export function SortableList<T>({
	items,
	onReorder,
	renderItem,
    renderOverlay,
	keyExtractor,
    className,
}: SortableListProps<T>) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

    const activeItem = items.find((item) => keyExtractor(item) === activeId);

	function handleDragStart(event: any) {
		setActiveId(event.active.id);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id.toString());
            const newIndex = items.findIndex((item) => keyExtractor(item) === over.id.toString());

			onReorder(arrayMove(items, oldIndex, newIndex));
		}

		setActiveId(null);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
		>
			<SortableContext
				items={items.map(keyExtractor)}
				strategy={verticalListSortingStrategy}
			>
				<div className={className}>
                    {items.map((item) => renderItem(item))}
                </div>
			</SortableContext>
            
            {createPortal(
                <DragOverlay dropAnimation={dropAnimation} modifiers={[restrictToVerticalAxis]}>
                    {activeId && activeItem ? (
                        renderOverlay ? renderOverlay(activeItem) : renderItem(activeItem)
                    ) : null}
                </DragOverlay>,
                document.body
            )}
		</DndContext>
	);
}
