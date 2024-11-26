import React from "react";
import Header from "./Headers.css"

export default function Headers({ links, handleLogout }) {
    return (
        <header>
            <nav>
                {links.map((link, index) => (
                    <a key={index} href={link.url}>  
                        {link.label}
                    </a>
                ))}
                <button onClick={handleLogout} style={{ marginLeft: '15px', cursor: 'pointer' }}>
                    Logout
                </button>
            </nav>  
                    
        </header>
    );
}
