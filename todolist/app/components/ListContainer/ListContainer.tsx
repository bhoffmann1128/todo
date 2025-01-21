'use client'
import { DragEvent, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ListItem from "../ListItem/ListItem";
import "./listcontainer-styles.css";

declare global {
    interface Window {
        dragOverTimeout: NodeJS.Timeout | undefined;
    }
}

export default function ListContainer() {
    const [items, setItems] = useState<Array<{id: string, content: string}>>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const listItemData:string[] = ["a","b","c"];
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [mouseIsOverBottom, setMouseIsOverBottom] = useState(false);

    const getDraggedItem = () => items.find(item => item.id === draggedId);

    useEffect(() => {
        setItems(listItemData.map(item => ({
            id: uuidv4(),
            content: item
        })));
    }, []);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
        setDragOverId(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string | null) => {
        e.preventDefault();
        if (dragOverId !== id && draggedId !== id) {
            if (window.dragOverTimeout) {
                clearTimeout(window.dragOverTimeout);
            }
            window.dragOverTimeout = setTimeout(() => {
                const element = e.currentTarget;
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const mouseY = e.clientY;
                    if (mouseY > rect.top && mouseY < rect.bottom) {
                        setDragOverId(id);
                    }
                }
            }, 50);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string | null) => {
        e.preventDefault();
        if (window.dragOverTimeout) {
            clearTimeout(window.dragOverTimeout);
        }
        
        // Only reorder if we actually dragged to a new position
        if (draggedId && dragOverId !== null && draggedId !== dragOverId) {
            setItems(prevItems => {
                const newItems = [...prevItems];
                const draggedIndex = newItems.findIndex(item => item.id === draggedId);
                const draggedItem = newItems[draggedIndex];
                
                // Remove the dragged item
                newItems.splice(draggedIndex, 1);
                
                if (dragOverId === null) {
                    // Drop at the end
                    newItems.push(draggedItem);
                } else {
                    // Drop at specific position
                    const dropIndex = newItems.findIndex(item => item.id === dragOverId);
                    newItems.splice(dropIndex, 0, draggedItem);
                }
                
                return newItems;
            });
        }
        
        setDraggedId(null);
        setDragOverId(null);
    };

    const handleListItemAdd = () => {
        setItems([...items, {id: uuidv4(), content: "New Item"}]);
    };

    const handleListItemDelete = (id:string) => {
      setItems(items.filter(item => item.id !== id));
    };

    const handleContentChange = (id: string, newContent: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, content: newContent } : item
            )
        );
    };

    return (
        <div 
            className="list-container"
            onDragOver={(e) => {
                e.preventDefault();
                const element = e.currentTarget;
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const mouseY = e.clientY;
                    const isOverBottom = mouseY > rect.bottom - 20;
                    setMouseIsOverBottom(isOverBottom);
                    if (isOverBottom) {
                        handleDragOver(e, null);
                    }
                }
            }}
            onDrop={(e) => handleDrop(e, null)}
        >
            {items.map((item) => (
                <>
                    {dragOverId === item.id && draggedId !== item.id && (
                        <div className="list-item-placeholder" />
                    )}
                    <div 
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        onDragEnd={() => {
                            if (window.dragOverTimeout) {
                                clearTimeout(window.dragOverTimeout);
                            }
                            setDraggedId(null);
                            setDragOverId(null);
                        }}
                        onDragOver={(e) => handleDragOver(e, item.id)}
                        onDragLeave={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setDragOverId(null);
                            }
                        }}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={`list-item-wrapper ${draggedId === item.id ? 'dragging' : ''}`}
                    >
                        <ListItem 
                            id={item.id}
                            content={item.content}
                            handleAdd={handleListItemAdd}
                            handleDelete={handleListItemDelete}
                            handleContentChange={handleContentChange}
                        />
                    </div>
                </>
            ))}
            {dragOverId === null && draggedId && mouseIsOverBottom && (
                <div className="list-item-placeholder" />
            )}
        </div>
    );
}