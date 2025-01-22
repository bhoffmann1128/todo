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

declare global {
  interface Window {
      dragOverTimeout: NodeJS.Timeout | undefined;
  }
}

export default function ListContainer() {
  
  
  const defaultListData = {
    title: "My List",
    items: [
      {
        id: uuidv4(),
        content: "Example Item 1"
      },
      {
        id: uuidv4(),
        content: "Example Item 2"
      }
    ]
  }
  // Initialize with lazy loading from localStorage or default values
  const [listTitle, setListTitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('todo-list');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.title || defaultListData.title;
      }
    }
    return defaultListData.title;
  });

  const [items, setItems] = useState<Array<{id: string, content: string}>>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('todo-list');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.items || defaultListData.items;
      }
    }
    return defaultListData.items;
  });

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [mouseIsOverBottom, setMouseIsOverBottom] = useState(false);
    const [isPlaceholderFading, setIsPlaceholderFading] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(false);
    const [fadingItemId, setFadingItemId] = useState<string | null>(null);
    const getDraggedItem = () => items.find(item => item.id === draggedId);
    

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {

    const saveList = {
      title: listTitle,
      items: items
    }
    localStorage.setItem('todo-list', JSON.stringify(saveList));    
  }, [items, listTitle]);

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
        setFadingItemId(draggedId);
        setShowPlaceholder(true);
        
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
          setFadingItemId(null);


        // Second timeout to clean up placeholder states after fade animation
        setTimeout(() => {
            setDragOverId(null);
            setMouseIsOverBottom(false);
            setIsPlaceholderFading(false);
            setShowPlaceholder(false);
        }, 300); // Match this with CSS transition duration
    },300);
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

    const handleListTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setListTitle(e.target.value);
    };

    return (
        <>
        <div className="list__header">
        <div className="list__header-left">
          <h1 className="list__header-title">TO<span>DO</span></h1>
          <input className="list__header-list-title" onChange={handleListTitleChange} type="text" placeholder={"My List"} defaultValue={listTitle}/>
        </div>
        <div className="list__header-right">
          <span className="list__header-date">{dateString}</span>
        </div>
      </div>
        <div 
            className="list-container"
            onDragOver={handleContainerDragOver}
            onDrop={(e) => handleDrop(e, null)}
        >
            {items.map((item) => (
              <div key={`list-item-wrapper-${item.id}`}>
              {(dragOverId === item.id && draggedId !== item.id) || 
                 (showPlaceholder && dragOverId === item.id) ? (
                    <div className={`list-item-placeholder ${isPlaceholderFading ? 'fade-out' : ''}`} />
                ) : null}
                <div key={`list-item-component-${item.id}`}>
                    <ListItem 
                        id={item.id}
                        content={item.content}
                        isDragging={draggedId === item.id}
                        className={`
                          ${draggedId === item.id ? 'dragging' : ''}
                          ${fadingItemId === item.id ? 'fade-out' : ''}
                          ${!draggedId && !fadingItemId ? 'fade-in' : ''}
                      `}
                        handleAdd={handleListItemAdd}
                        handleDelete={handleListItemDelete}
                        handleContentChange={handleContentChange}
                        onDragStart={handleDragStart}
                        onDragOver={handleItemDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                    />
                </div>
              </div>
            ))}
            {(dragOverId === null && draggedId && mouseIsOverBottom) || 
            (showPlaceholder && mouseIsOverBottom) ? (
                <div className={`list-item-placeholder ${isPlaceholderFading ? 'fade-out' : ''}`} />
            ) : null}
        </div>
        </>
    );
}