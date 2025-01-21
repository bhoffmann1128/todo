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

    const getDraggedItem = () => items.find(item => item.id === draggedId);

    useEffect(() => {
        setItems(listItemData.map(item => ({
            id: uuidv4(),
            content: item
        })));
    }, []);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string | null) => {
        e.preventDefault();
        if (dragOverId !== id && draggedId !== id) {
            // Clear any existing timeout
            if (window.dragOverTimeout) {
                clearTimeout(window.dragOverTimeout);
            }
            // Set dragOver after a small delay
            window.dragOverTimeout = setTimeout(() => {
                setDragOverId(id);
            }, 50); // 50ms delay
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
                // Only show bottom placeholder if we're actually dragging over the container
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    handleDragOver(e, null);
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
            {dragOverId === null && draggedId && (
                <div className="list-item-placeholder" />
            )}
        </div>
    );
}