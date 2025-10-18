import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, clearMessages, setCurrentConsultation } from '../../store/slices/consultationSlice';
import consultationService from '../../services/consultationService';
import io from 'socket.io-client';

const Consultation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, currentConsultation } = useSelector((state) => state.consultations);
  
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [socket, setSocket] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    initializeConsultation();
    setupSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConsultation = async () => {
    try {
      const response = await consultationService.getConsultationById(id);
      dispatch(setCurrentConsultation(response.data));
      
      const messagesResponse = await consultationService.getMessages(id);
      messagesResponse.data.forEach(message => {
        dispatch(addMessage(message));
      });
    } catch (error) {
      console.error('Failed to initialize consultation:', error);
    }
  };

  const setupSocket = () => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.emit('join-consultation', { consultationId: id });

    newSocket.on('message', (message) => {
      dispatch(addMessage(message));
    });

    newSocket.on('offer', async (offer) => {
      await handleOffer(offer);
    });

    newSocket.on('answer', async (answer) => {
      await handleAnswer(answer);
    });

    newSocket.on('ice-candidate', async (candidate) => {
      await handleIceCandidate(candidate);
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      consultationId: id,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await consultationService.sendMessage(id, newMessage);
      socket.emit('message', message);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
      setIsVideoCallActive(true);

      // Setup peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            consultationId: id,
            candidate: event.candidate,
          });
        }
      };

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', {
        consultationId: id,
        offer: offer,
      });

    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsVideoCallActive(false);
    setRemoteStream(null);
  };

  const handleOffer = async (offer) => {
    try {
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', {
        consultationId: id,
        answer: answer,
      });
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnection.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const endConsultation = async () => {
    try {
      await consultationService.endConsultation(id);
      alert('Consultation ended successfully');
    } catch (error) {
      console.error('Failed to end consultation:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Consultation with Dr. {currentConsultation?.doctor?.firstName} {currentConsultation?.doctor?.lastName}
            </h1>
            <p className="text-sm text-gray-600">
              {currentConsultation?.doctor?.specialization}
            </p>
          </div>
          <div className="flex space-x-2">
            {!isVideoCallActive ? (
              <button
                onClick={startVideoCall}
                className="btn-primary"
              >
                Start Video Call
              </button>
            ) : (
              <button
                onClick={endVideoCall}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                End Video Call
              </button>
            )}
            <button
              onClick={endConsultation}
              className="btn-secondary"
            >
              End Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 input-field"
              />
              <button
                onClick={sendMessage}
                className="btn-primary"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {isVideoCallActive && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-900">
            <div className="h-full flex flex-col">
              {/* Remote Video */}
              <div className="flex-1 bg-gray-800 flex items-center justify-center">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Local Video */}
              <div className="h-32 bg-gray-700 flex items-center justify-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;
