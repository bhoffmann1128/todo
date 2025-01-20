'use client'
import ListItem from "../ListItem/ListItem";
import "./listcontainer-styles.css";

export default function ListContainer(){

    const handleListItemMove = () => {

    }

    const handleListItemAdd = () => {

    }

    const handleListItemDelete = () => {

    }

    return (
        <div className="list-container">
            <ListItem 
                handleMove={handleListItemMove}
                handleAdd={handleListItemAdd}
                handleDelete={handleListItemDelete}
            />
        </div>
    )
}