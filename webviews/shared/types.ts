export type State = 
  | { page: "view-profile" }
  | { page: "login" }
  | { page: "loading" };

  export interface User {
    uuid: string,
    email: string,
    name: string,
    avatar: string,
  }

  export interface MeResponse {
  user: User;
}