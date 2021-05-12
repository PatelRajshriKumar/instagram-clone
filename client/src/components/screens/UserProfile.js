import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';

const Profile = ()=>{
    const [userProfile,setUserProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setshowfollow] = useState(!state.following.includes(userid))
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            
            setUserProfile(result)
        })
    },[])

    const followUser= ()=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            }) 
        }).then(res => res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("User",JSON.stringify(data))
            setUserProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setshowfollow(false)
        })
    }

    const unfollowUser= ()=>{
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            }) 
        }).then(res => res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("User",JSON.stringify(data))
         
            setUserProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setshowfollow(true)
            
        })
    }

    return(
        <>
        {userProfile ?
        
        <div style={{maxWidth:'550px',margin:'0px auto'}}>
            <div style={{
                display:'flex',
                justifyContent:'space-around',
                margin:'18px 0px',
                borderBottom:'2px solid grey'
            }} >
                <div>
                    <img style={{width:'160px',height:'160px',borderRadius:"80px"}} 
                    src="https://images.unsplash.com/photo-1518632661489-148f744fb48e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fHNwbGFzaHxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    />
                </div>
                <div>
                    <h4>{userProfile.user.name} </h4>
                    <h5>{userProfile.user.email} </h5>
                    <div style={{display:'flex',justifyContent:'space-between', width:'110%'}} >
                        <h6>{userProfile.post.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {showfollow ?  <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                    onClick={()=>followUser()}
                    >
                     Follow
                    </button>
                    :
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                    onClick={()=>unfollowUser()}
                    >
                     UnFollow
                    </button>
                    }
                   
                    
                </div>
            </div>
            <div className='gallery'>
                {
                    userProfile.post.map(item=>{
                        return(
                            <img key={item._id} className='item' src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>

        : <h2>loading...</h2>}
        
        </>
    )
}

export default Profile