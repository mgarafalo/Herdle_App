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
  login: (user: User) => requests.post<User>("/herdle/login", user),
  signUp: (user: User) => requests.post<User>("/herdle/new", user),
  getUserInfo: (userId: string) =>
    requests.get<User>(`/herdle/profile?userId=${userId}`),
  followUserAction: (userId: string, userInQuestion: string) =>
    requests.post<User>("/herdle/followAction", { userId, userInQuestion }),
  uploadAvatarImage: (userId: string, file: File[]) =>
    imageUploadHelper<User>(
      file,
      `/herdle/profilePicture/upload?userId=${userId}&location=User`
    ),
};

const Dashboard = {
  getDashboardInfo: (userId: string) => requests.get(`/dashboard/${userId}`),
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
  getSingleAnimal: (animalId: string) =>
    requests.get<Animal>(`/animal/single?animalId=${animalId}`),
  newAnimal: (animal: Animal, userId: string) =>
    requests.post<Animal>(`/animal/add?userId=${userId}`, animal),
  deleteAnimal: (animalId: string) =>
    requests.post<void>(`/animal/delete`, { animalId }),
};

const Posts = {
  allPosts: () => requests.get<Post[]>("/post/serve"),
  newPost: (
    userId: string,
    post: string,
    file: File[] | undefined = undefined
  ) => {
    if (!!file) {
      return imageUploadHelper(file, `/post/new`, { userId, post });
    }
    return requests.post<Post>("/post/new", { userId, post });
  },
  likePost: (userId: string, postId: string) =>
    requests.post<User>("/post/likePost", { userId, postId }),
  comment: (userId: string, postId: string, commentBody: string) =>
    requests.post<User>("/post/comment", { userId, postId, commentBody }),
};

const agent = {
  Account,
  Dashboard,
  Herd,
  Animal,
  Posts,
};

export default agent;

function imageUploadHelper<T>(file: File[], url: string, body?: any) {
  let formData = new FormData();
  formData.append("file", file[0]);
  if (body) {
    Object.entries(body).forEach((value: any) => {
      console.log(value);
      formData.append(`${value[0]}`, value[1]);
    });
  }
  return requests.post<T>(url, formData, {
    headers: { "content-type": "multipart/form-data" },
  });
}
