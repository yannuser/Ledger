import React from "react";
import axios from 'axios';
import { useState, useEffect } from "react";


export default function Home({authorId}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log(authorId);
 
            try {
                await axios.get('http://localhost:5000/LearningGoal/getByUser/', { params: { authorId } }
                ).then(result => {
                    console.log(result);
                    if (result.status == 200) {
                        setData(result.data)
                    }
                });
                
            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        }

        fetchData();
    }, [authorId]);
    
    return(
        <>
            {loading && <div>Loading</div>}
            {!loading && (
            <div>
                <h2>Learning goals</h2>
                {data.map(item => (<p>{item.title} : <span>{item.description}</span></p>))}
            </div>
            )}  
        </>
    )
}