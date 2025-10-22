const AUTH_KEY = 'venevalores-authenticated';

type AuthSubscriber = (authenticated: boolean) => void;

const subscribers = new Set<AuthSubscriber>();

const notify = (value: boolean) => {
  subscribers.forEach((subscriber) => subscriber(value));
};

export const authStorage = {
  isAuthenticated: () => localStorage.getItem(AUTH_KEY) === 'true',
  login: () => {
    localStorage.setItem(AUTH_KEY, 'true');
    notify(true);
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    notify(false);
  },
  subscribe: (subscriber: AuthSubscriber) => {
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  },
};
