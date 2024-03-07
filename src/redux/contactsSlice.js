// ContactSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Acțiuni asincrone
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://65e705e653d564627a8dab74.mockapi.io/api/v1/contacts'
      );
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://65e705e653d564627a8dab74.mockapi.io/api/v1/contacts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contact),
        }
      );
      if (!response.ok) throw new Error('Failed to add contact');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://65e705e653d564627a8dab74.mockapi.io/api/v1/contacts/${contactId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete contact');
      return contactId;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const initialState = {
  contacts: {
    items: [],
    isLoading: false,
    error: null,
  },
  filter: '',
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchContacts.pending, state => {
        state.contacts.isLoading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts.items = action.payload;
        state.contacts.isLoading = false;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contacts.isLoading = false;
        state.contacts.error = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.items.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts.items = state.contacts.items.filter(
          contact => contact.id !== action.payload
        );
      });
  },
});

export const { setFilter } = contactsSlice.actions;

export default contactsSlice.reducer;
