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
    const listItemData:string[] = ["a","b","c"]; //the initial content of the list items.
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [mouseIsOverBottom, setMouseIsOverBottom] = useState(false);
    const [isPlaceholderFading, setIsPlaceholderFading] = useState(false);

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
            setDragOverId(id);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string | null) => {
        e.preventDefault();
        if (window.dragOverTimeout) {
            clearTimeout(window.dragOverTimeout);
        }
        
        setIsPlaceholderFading(true);
        
          setTimeout(() => {

            if (draggedId && (dragOverId !== null || mouseIsOverBottom)) {
              setItems(prevItems => {
                  const newItems = [...prevItems];
                  const draggedIndex = newItems.findIndex(item => item.id === draggedId);
                  const draggedItem = newItems[draggedIndex];
                  
                  newItems.splice(draggedIndex, 1);
                  
                  if (mouseIsOverBottom) {
                      newItems.push(draggedItem);
                  } else if (dragOverId) {
                      const dropIndex = newItems.findIndex(item => item.id === dragOverId);
                      newItems.splice(dropIndex, 0, draggedItem);
                  }
                  
                  return newItems;
              });
          }
            setDraggedId(null);
            setDragOverId(null);
            setMouseIsOverBottom(false);
            setIsPlaceholderFading(false);
        }, 200); // Match this with CSS animation duration
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

    const handleItemDragOver = (e: DragEvent<HTMLDivElement>, itemId: string) => {
        if (itemId !== draggedId) {
            const currentIndex = items.findIndex(i => i.id === itemId);
            const draggedIndex = items.findIndex(i => i.id === draggedId);
            
            if (currentIndex !== draggedIndex + 1 ) { 
                /*if (window.dragOverTimeout) {
                    clearTimeout(window.dragOverTimeout);
                }*/
                window.dragOverTimeout = setTimeout(() => {
                    handleDragOver(e, itemId);
                }, 10);
            }
        }
    };

    const handleDragEnd = () => {
        if (window.dragOverTimeout) {
            clearTimeout(window.dragOverTimeout);
        }
        setDraggedId(null);
        setDragOverId(null);
        setMouseIsOverBottom(false);
    };

    const handleContainerDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const element = e.currentTarget;
        if (element) {
            const rect = element.getBoundingClientRect();
            const mouseY = e.clientY;
            const isOverBottom = mouseY > rect.bottom - 60;
            setMouseIsOverBottom(isOverBottom);
            if (isOverBottom) {
                handleDragOver(e, null);
            }
        }
    };

    return (
        <div 
            className="list-container"
            onDragOver={handleContainerDragOver}
            onDrop={(e) => handleDrop(e, null)}
        >
            {items.map((item) => (
              <>
              {dragOverId === item.id && draggedId !== item.id && (
                <div className={`list-item-placeholder ${isPlaceholderFading ? 'fade-out' : ''}`} />
              )}
                <div key={item.id}>
                    <ListItem 
                        id={item.id}
                        content={item.content}
                        isDragging={draggedId === item.id}
                        handleAdd={handleListItemAdd}
                        handleDelete={handleListItemDelete}
                        handleContentChange={handleContentChange}
                        onDragStart={handleDragStart}
                        onDragOver={handleItemDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                    />
                </div>
                </>
            ))}
            {dragOverId === null && draggedId && mouseIsOverBottom && (
                <div className={`list-item-placeholder ${isPlaceholderFading ? 'fade-out' : ''}`} />
            )}
        </div>
    );
}