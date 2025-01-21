'use client'
import { DragEvent, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ListItem from "../ListItem/ListItem";
import "./listcontainer-styles.css";

export default function ListContainer() {
    const [items, setItems] = useState<Array<{id: string, content: string}>>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const listItemData:string[] = ["a","b","c"];

    useEffect(() => {
        setItems(listItemData.map(item => ({
            id: uuidv4(),
            content: item
        })));
    }, []);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDrop = (targetId: string) => {
        if (draggedId && draggedId !== targetId) {
            setItems(prevItems => {
                const newItems = [...prevItems];
                const draggedIndex = newItems.findIndex(item => item.id === draggedId);
                const dropIndex = newItems.findIndex(item => item.id === targetId);
                
                const [draggedItem] = newItems.splice(draggedIndex, 1);
                newItems.splice(dropIndex, 0, draggedItem);
                
                return newItems;
            });
        }
        setDraggedId(null);
    };

    const handleListItemAdd = () => {
        setItems([...items, {id: uuidv4(), content: "New Item"}]);
    };

    const handleListItemDelete = (id:string) => {
      console.log("DELETE ID",id);
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
        <div className="list-container">
            {items.map((item) => (
                <div 
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(item.id)}
                >
                    <ListItem 
                        id={item.id}
                        content={item.content}
                        handleAdd={handleListItemAdd}
                        handleDelete={handleListItemDelete}
                        handleContentChange={handleContentChange}
                    />
                </div>
            ))}
        </div>
    );
}