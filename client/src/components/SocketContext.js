import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Peer } from "simple-peer";

const SocketContext = createContext();

const socket = io('http://localhost:3000')

const ContextProvider = ({ children }) => {
    const [me, setMe] = useState('')
    const [stream, setStream] = useState(null)
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)

    const myVideo = useRef()
    const userVideo = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        })
        socket.on('me', (id) => setMe(id))

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        })
    }, [])

    const answerCall = () => {
        setCallAccepted(true)
        //initiator:false -> we are not initiating the calls we are answering
        //for video chat there is 2 options: 
        //1. trickle
        //2.
        const peer = new Peer({ initiator: false, trickle: false, stream })

        //once we receive the signal we have a callback function
        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })
    }
    const calUser = () => {

    }
    const leaveCall = () => {

    }
}