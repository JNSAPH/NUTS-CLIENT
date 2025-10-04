"use client";

import { IcoPlusBorder } from '@/components/Icons';
import { ask } from '@tauri-apps/plugin-dialog';
import {
  setFileContent,
  setSelectedRequestIndex,
} from '@/redux/slices/projectFile';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { AuthTypes } from '@/types/Auth';

// dnd-kit
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarItemProps {
  name: string;
  index: number;
  active?: boolean;
  id: string;
}

function SidebarItem({ name, index, active, id }: SidebarItemProps) {
  const dispatch = useDispatch();
  const content = useSelector((state: RootState) => state.projectFile);

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(name);

  useEffect(() => {
    setInputValue(name);
  }, [name]);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useSortable({ id, disabled: isEditing });

const style: React.CSSProperties = {
  transform: CSS.Transform.toString(transform),
  transition: isDragging ? 'none' : 'none', // disable the tr
};
  async function removeRequest() {
    if (!content.fileContent) return;
    const answer = await ask('This action cannot be reverted. Are you sure?', {
      title: 'Delete Request',
      kind: 'warning',
    });
    if (!answer) return;

    dispatch(setFileContent({
      ...content.fileContent,
      requests: content.fileContent.requests.filter((_, i) => i !== index),
    }));
  }

  async function cloneRequest() {
    if (!content.fileContent) return;
    dispatch(setFileContent({
      ...content.fileContent,
      requests: [
        ...content.fileContent.requests,
        content.fileContent.requests[index],
      ],
    }));
  }

  const selectedRequest = useSelector(
    (state: RootState) =>
      state.projectFile.fileContent?.requests[
        state.projectFile.selectedRequestIndex
      ]
  );

  const handleDoubleClick = () => setIsEditing(true);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleInputBlur = () => {
    setIsEditing(false);
    if (selectedRequest && content.fileContent && inputValue.trim()) {
      dispatch(setFileContent({
        ...content.fileContent,
        requests: content.fileContent.requests.map((req, i) =>
          i === content.selectedRequestIndex ? { ...selectedRequest, name: inputValue } : req
        ),
      }));
    } else {
      setInputValue(name);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleInputBlur();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          className={`flex items-center p-1 rounded-md hover:bg-clientColors-card-background transition-all justify-between cursor-pointer ${
            active ? 'bg-clientColors-card-background' : ''
          }`}
          onClick={() => dispatch(setSelectedRequestIndex(index))}
        >
          <div className="flex items-center gap-2 w-full">
            {/* Drag handle */}
            <button
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing px-1 select-none text-sm opacity-70 hover:opacity-100"
              aria-label="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              ⋮⋮
            </button>

            {/* Editable name */}
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="bg-clientColors-card-background border text-sm border-clientColors-card-border w-full"
              />
            ) : (
              <p onDoubleClick={handleDoubleClick} className="text-sm w-full">
                {name}
              </p>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={cloneRequest}>Clone Request</ContextMenuItem>
        <ContextMenuItem onClick={() => setIsEditing(true)}>Rename Request</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-red-500 space-x-2 focus:bg-[#1e0a0a]"
          onClick={removeRequest}
        >
          <p>Delete Request</p>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function ExplorerSideBar() {
  const content = useSelector((state: RootState) => state.projectFile);
  const settings = useSelector(
    (state: RootState) => state.windowProperties.clientSettings
  );
  const [isEditingProjectName, setIsEditingProjectName] = React.useState(false);
  const [projectNameInput, setProjectNameInput] = React.useState(
    content.fileContent?.name || ''
  );
  const dispatch = useDispatch();

  // Sensors (distance/delay prevents double click from triggering drag)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !content.fileContent) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (oldIndex === newIndex) return;

    const newRequests = arrayMove(content.fileContent.requests, oldIndex, newIndex);
    dispatch(setFileContent({ ...content.fileContent, requests: newRequests }));

    // Keep selection consistent
    if (content.selectedRequestIndex === oldIndex) {
      dispatch(setSelectedRequestIndex(newIndex));
    } else if (
      content.selectedRequestIndex > Math.min(oldIndex, newIndex) &&
      content.selectedRequestIndex <= Math.max(oldIndex, newIndex)
    ) {
      const shift = oldIndex < newIndex ? -1 : 1;
      dispatch(setSelectedRequestIndex(content.selectedRequestIndex + shift));
    }
  }

  async function addNewRequest() {
    if (content.fileContent) {
      await dispatch(setFileContent({
        ...content.fileContent,
        requests: [
          ...content.fileContent.requests,
          {
            name: 'Untitled Request',
            url: settings.defaultNATSURL,
            data: '',
            topic: '',
            authentication: { type: AuthTypes.NONE },
          },
        ],
      }));
      await dispatch(setSelectedRequestIndex(content.fileContent.requests.length));
    }
  }

  return (
    <div className="h-full w-full border-r-2 border-clientColors-windowBorder overflow-auto space-y-[2px] p-2">
          <div className="flex justify-between items-center">
            {isEditingProjectName ? (
              <input
                type="text"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                onBlur={() => setIsEditingProjectName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingProjectName(false)}
                autoFocus
                className="bg-clientColors-card-background border border-clientColors-card-border w-full mr-2"
              />
            ) : (
              <p
                onDoubleClick={() => setIsEditingProjectName(true)}
                className="font-bold cursor-pointer"
              >
                {content.fileContent?.name}
              </p>
            )}
            <div
              className="transition-all hover:scale-105 active:scale-95 cursor-pointer"
              onClick={addNewRequest}
            >
              <IcoPlusBorder size={18} />
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.fileContent?.requests.map((_, i) => i.toString()) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {content.fileContent?.requests.map((request, i) => (
                <SidebarItem
                  key={i}
                  id={i.toString()}
                  name={request.name}
                  index={i}
                  active={content.selectedRequestIndex === i}
                />
              ))}
            </SortableContext>
          </DndContext>
    </div>
  );
}
