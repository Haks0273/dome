import { defineStore } from "pinia";


export const useWsStore =  defineStore('ws', () => {
   
    const generateHash = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 11; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    const hash = ''
    const createWebSocketConnection = () => {
        const ws = new WebSocket('ws://127.0.0.1:7860/queue/join');
    
        ws.onopen = function open() {
            console.log("WebSocket connection established.");
        };
        ws.onclose = function close() {
            console.log("WebSocket connection closed.");
        };
        return ws;
    };


    return {
        createWebSocketConnection,
        generateHash,
        hash
    }
})