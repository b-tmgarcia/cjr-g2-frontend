import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:3000', // Replace with your API base URL
    });

// exemplo do vídeo- falta mexer
// busca user.controller.ts e encontra a rota getUser, depois mexe aqui pra chamar essa rota
// const getUser = async () => { 
//     await api.get("/user");
//     await api.get("/user/email");
// };


// // outra rota: usando o id
// const getUser = async (id: number) => { 
//     await api.patch("/user/${id}");
// };

// const getUser = async (dados: User) => {
//     const response = await api.patch("/user", dados);
//     return response.data;
// }