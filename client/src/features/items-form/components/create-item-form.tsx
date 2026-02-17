import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useCreateItem } from '../api';

const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
});

export function CreateItemForm() {
  const createItem = useCreateItem();

  const form = useForm({
    defaultValues: { title: '' },
    validators: {
      onSubmit: ({ value }) => {
        const result = createItemSchema.safeParse(value);
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          return {
            fields: {
              title: fieldErrors.title?.[0],
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const parsed = createItemSchema.parse(value);
      await createItem.mutateAsync(parsed);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Flex gap="2" align="flex-start">
        <Box flex="1">
          <form.Field name="title">
            {(field) => (
              <>
                <Input
                  placeholder="New item title..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {field.state.meta.errors.join(', ')}
                  </Text>
                )}
              </>
            )}
          </form.Field>
        </Box>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" colorPalette="blue" loading={isSubmitting}>
              Add
            </Button>
          )}
        </form.Subscribe>
      </Flex>
    </form>
  );
}
