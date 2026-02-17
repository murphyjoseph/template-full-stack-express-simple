import { useActionState, useRef } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '@/lib/api-client';
import type { Item } from '../types';

const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
});

type FormState = {
  errors?: { title?: string };
};

export function CreateItemForm() {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const result = createItemSchema.safeParse({
        title: formData.get('title'),
      });

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return { errors: { title: fieldErrors.title?.[0] } };
      }

      try {
        await api.post<Item>('/items', { title: result.data.title });
      } catch {
        return {
          errors: { title: 'Failed to create item. Please try again.' },
        };
      }

      await queryClient.invalidateQueries({ queryKey: ['items'] });
      formRef.current?.reset();
      return {};
    },
    {}, // Initial action state (errors, etc.) before first submission
  );

  return (
    <form ref={formRef} action={formAction}>
      <Flex gap="2" align="flex-start">
        <Box flex="1">
          <Input name="title" placeholder="New item title..." />
          {state.errors?.title && (
            <Text color="red.500" fontSize="sm" mt="1">
              {state.errors.title}
            </Text>
          )}
        </Box>
        <Button type="submit" colorPalette="blue" loading={isPending}>
          Add
        </Button>
      </Flex>
    </form>
  );
}
