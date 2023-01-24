import { Post } from "@prisma/client";
import axios, { AxiosHeaders, AxiosResponse } from "axios";
import FormData from "form-data";
import { File } from "formidable";
import { User } from "../Interfaces/Account";
import { Animal, Herd } from "../Interfaces/Animal";
import { appStore } from "../store/store";

axios.defaults.baseURL = "http://localhost:8080";

axios.interceptors.request.use((config) => {
  const token = appStore.getState().appState.user.token;
  if (!token) {
    const jwt = JSON.parse(window.localStorage.getItem("Herdle/Auth")!);
    if (jwt) {
      config.headers = {
        Bearer: jwt.token,
      };
    }
  } else if (token) {
    config.headers = {
      Bearer: token,
    };
  }
  return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object, headers?: object) =>
    axios.post<T>(url, body, headers).then(responseBody),
};

const Account = {
  login: (user: User) => requests.post<User>("/login", user),
  signUp: (user: User) => requests.post<User>("/herdle/new", user),
  getUserInfo: (userId: string) =>
    requests.get<User>(`/herdle/profile?userId=${userId}`),
  followUserAction: (userId: string, userInQuestion: string) =>
    requests.post<User>("/herdle/followAction", { userId, userInQuestion }),
  uploadAvatarImage: (userId: string, file: File[]) => {
    let formData = new FormData();
    formData.append("file", file[0]);
    return requests.post<User>(
      `/herdle/profilePicture/upload?userId=${userId}&location=User`,
      formData,
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
  },
};

const Herd = {
  getSingleHerd: (herdId: string) =>
    requests.get<Herd>(`/herd/single?herdId=${herdId}`),
  getUserHerds: (userId: string) =>
    requests.get<Herd[]>(`/all_herds?userId=${userId}`),
  createNewHerd: (name: string) => requests.post<Herd>(`/herd/new`, { name }),
  addAnimalToHerd: (herdId: string, animalId: string) =>
    requests.post<Herd>(`/herd/add_animal`, { herdId, animalId }),
  removeAnimalFromHerd: (herdId: string, animalId: string) =>
    requests.post(`/herd/remove_animal`, { herdId, animalId }),
};

const Animal = {
  getUsersAnimals: (userId: string) =>
    requests.get<Animal[]>(`/herdle/animals?userId=${userId}`),
  newAnimal: (animal: Animal, userId: string) =>
    requests.post<Animal>(`/animal/add?userId=${userId}`, animal),
  deleteAnimal: (animalId: string) =>
    requests.post<void>(`/animal/delete`, { animalId }),
};

const Posts = {
  newPost: (userId: string, post: string) =>
    requests.post<Post>(`/post/new`, { userId, post }),
  likePost: (userId: string, postId: string) =>
    requests.post<User>("/post/likePost", { userId, postId }),
  comment: (userId: string, postId: string, commentBody: string) =>
    requests.post<User>("/post/comment", { userId, postId, commentBody }),
};

const agent = {
  Account,
  Herd,
  Animal,
  Posts,
};
export default agent;
