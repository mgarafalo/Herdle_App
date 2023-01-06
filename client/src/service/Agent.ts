import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { User } from '../Interfaces/Account';
import { Animal, Herd } from '../Interfaces/Animal';
import { appStore } from '../store/store';

axios.defaults.baseURL = 'http://localhost:8080';

axios.interceptors.request.use((config) => {
  const token = appStore.getState().appState.user.token;
  if (!token) {
    const jwt = JSON.parse(window.localStorage.getItem('Herdle/Auth')!);
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
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody),
};

const Account = {
  login: (user: User) => requests.post<User>('/login', user),
  signUp: (user: User) => requests.post<User>('/user/new', user),
  getUserInfo: (userId: string) =>
    requests.get<User>(`/user/profile?userId=${userId}`),
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
    requests.get<Animal[]>(`/user/animals?userId=${userId}`),
  newAnimal: (animal: Animal, userId: string) =>
    requests.post<Animal>(`/animal/add?userId=${userId}`, animal),
  deleteAnimal: (animalId: string) =>
    requests.post<void>(`/animal/delete`, { animalId }),
};

const agent = {
  Account,
  Herd,
  Animal,
};
export default agent;
