import React, { useContext } from 'react';
import '../App.css';
import {Link, useHistory} from 'react-router-dom';
import { UserContext } from '../App';

const Navbar = ()=>{
     const {state,dispatch} = useContext(UserContext)
     const history = useHistory();
     const renderList = ()=>{
       if(state){
         return [
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/createpost">CreatePost</Link></li>,
          <li><Link to='/myfollowingpost'>My following Post</Link></li>,
          <li>
            <button className="btn waves-effect waves-light #c62828 red darken-3" 
             onClick={()=>{
               localStorage.clear()
               dispatch({type:'CLEAR'})
               history.replace('/login');
             }}
            >
                     LogOut
                </button>
          </li>
         ]
       }else{
        return [
          <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
        ]
       }
     }
    return(
        <nav>
    <div className="nav-wrapper white" >
      <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
        
    )
}

export default Navbar