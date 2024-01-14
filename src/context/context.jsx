import { createContext, useContext, useReducer,useEffect } from "react";
import reducer from "../reducer";
const AppContext=createContext();  //context creation

const initialState=
    {
        isLoading:true,
        query:"Latest global news",
        nbPages:0,
        page:0,
        hits:[]
    }
let apiurl="https://newsapi.org/v2/everything?"

//create a provider function
const AppProvider =({children})=>
{
    const [state, dispatch] = useReducer(reducer,initialState)
    const fetchApi=async(url)=>
    {
        dispatch({type:"SET_LOADING"})
        try{
            const res= await fetch(url);
            const data= await res.json();
            console.log(data.articles)
            dispatch({
                type: "GET_STORIES",
                payload:{
                    hits:data.articles,
                    nbPages:data.totalResults
                }
            })
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const removePost = (postid)=>
    {
        dispatch({type:"REMOVE_POST", payload: postid})
    }

    const searchPost=(searchquery)=>
    {
        dispatch({type: "SEARCH_QUERY", payload: searchquery})
    }

    useEffect(()=>
    {
       fetchApi(`${apiurl}q=${state.query ==="" ? "Global news" : state.query}&?language=en&apiKey=617ba767057243cfa5aad12904e99502`);
    },[state.query]);

    return(
        <AppContext.Provider value={{...state,removePost,searchPost}}>
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext= ()=>
{
    return useContext(AppContext)
}
export {AppContext,AppProvider,useGlobalContext};