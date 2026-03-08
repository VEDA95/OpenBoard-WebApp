import { createContext, useContext } from 'react';
import type { ReactElement, FC, Context, PropsWithChildren } from 'react';
import type { AuthPageContextType } from '@appTypes/auth';

export interface AuthPageProviderProps extends PropsWithChildren {
  context: AuthPageContextType;
}

const AuthPageContext = createContext<AuthPageContextType | null>(null);

export function useAuthPageContext(): AuthPageContextType {
  const context = useContext<AuthPageContextType | null>(AuthPageContext);

  if (context == null) throw Error('auth page context hook must be used by component child inside auth page provider');

  return context;
}

export function AuthPageProvider({ children, context }: AuthPageProviderProps): ReactElement<FC> {
  return (
    <AuthPageContext.Provider value={context}>
      {children}
    </AuthPageContext.Provider>
  );
}
