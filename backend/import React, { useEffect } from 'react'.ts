import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthComponent = ({ children }) => {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login')
        }
    }, [])
    return localStorage.getItem("token") ? children : null
}

export default AuthComponent



