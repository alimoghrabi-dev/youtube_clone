export interface UserSession {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    bio: string;
    contactEmail: string;
    subscribers: string;
  };
}

export interface SearchParamsProps {
  filter: string;
}
