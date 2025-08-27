import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useNavigate } from "react-router-dom";


export const useChatAccess = () =>{
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state)=>state.isLoggedIn)
    const openLoginModal = useUIStore((state)=>state.openLoginModal)

    const requestChatAceess = () =>{
        if (isLoggedIn){
            navigate('/chat')
        }
        else{
            openLoginModal();
        }
    };

    return requestChatAceess
}