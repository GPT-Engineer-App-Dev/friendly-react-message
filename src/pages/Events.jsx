import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from '../integrations/supabase/index.js';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Events = () => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [formState, setFormState] = useState({ id: null, name: '', date: '', venue: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.id) {
      updateEvent.mutate(formState);
    } else {
      addEvent.mutate(formState);
    }
    setFormState({ id: null, name: '', date: '', venue: '' });
  };

  const handleEdit = (event) => {
    setFormState(event);
  };

  const handleDelete = (id) => {
    deleteEvent.mutate(id);
  };

  if (eventsLoading || venuesLoading) return <div>Loading...</div>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formState.name} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="date">
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={formState.date} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="venue">
            <FormLabel>Venue</FormLabel>
            <Select name="venue" value={formState.venue} onChange={handleInputChange}>
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>{venue.name}</option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">{formState.id ? 'Update' : 'Create'} Event</Button>
        </VStack>
      </form>

      <Table variant="simple" mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Venue</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => (
            <Tr key={event.id}>
              <Td>{event.name}</Td>
              <Td>{event.date}</Td>
              <Td>{venues.find((venue) => venue.id === event.venue)?.name}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton icon={<FaEdit />} onClick={() => handleEdit(event)} />
                  <IconButton icon={<FaTrash />} onClick={() => handleDelete(event.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Events;