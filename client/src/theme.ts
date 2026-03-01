import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Bricolage Grotesque', sans-serif` },
        body: { value: `'Karla', sans-serif` },
      },
    },
  },
});
