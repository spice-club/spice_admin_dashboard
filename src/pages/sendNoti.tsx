import React, { useState } from 'react';
import {
  Typography,
  Divider,
  TextField,

  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';
import { notificationOperations } from '../api';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Section = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));



const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const SendNoti: React.FC = () => {
  const [notificationType, setNotificationType] = useState<'all' | 'one' | 'list'>('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [singleUser, setSingleUser] = useState('');

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendNotification = async () => {
    setIsLoading(true);
    setError(null);
    try {
      switch (notificationType) {
        case 'all':
          await notificationOperations.sendToAllUsers(notificationTitle, notificationBody);
          break;
        case 'one':
          await notificationOperations.sendToSingleUser(singleUser, notificationTitle, notificationBody);
          break;
        case 'list':
          await notificationOperations.sendToUserList(selectedUsers, notificationTitle, notificationBody);
          break;
      }
      // Reset form
      setNotificationTitle('');
      setNotificationBody('');
      setSingleUser('');
      setSelectedUsers([]);
      setNotificationType('all');
    } catch (err) {
      setError('Failed to send notification. Please try again.');
      console.error('Error sending notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    if (newUser && !selectedUsers.includes(newUser)) {
      setSelectedUsers([...selectedUsers, newUser]);
      setNewUser('');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Send Notification</Typography>
      <Divider sx={{ my: 3 }} />
      <Section>
        <FormControl fullWidth>
          <InputLabel>Notification Type</InputLabel>
          <Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value as 'all' | 'one' | 'list')}
            label="Notification Type"
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="one">Single User</MenuItem>
            <MenuItem value="list">List of Users</MenuItem>
          </Select>
        </FormControl>
      </Section>
      <Section>
        <TextField
          label="Notification Title"
          variant="outlined"
          fullWidth
          value={notificationTitle}
          onChange={(e) => setNotificationTitle(e.target.value)}
        />
      </Section>
      <Section>
        <TextField
          label="Notification Body"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={notificationBody}
          onChange={(e) => setNotificationBody(e.target.value)}
        />
      </Section>
      {notificationType === 'one' && (
        <Section>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={singleUser}
            onChange={(e) => setSingleUser(e.target.value)}
          />
        </Section>
      )}
      {notificationType === 'list' && (
        <Section>
          <TextField
            label="Add User"
            variant="outlined"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
          />
          <Button onClick={handleAddUser} variant="outlined" sx={{ ml: 2 }}>
            Add User
          </Button>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Selected Users:
          </Typography>
          {selectedUsers.map((user) => (
            <Chip
              key={user}
              label={user}
              onDelete={() => setSelectedUsers(selectedUsers.filter((u) => u !== user))}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Section>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleSendNotification}
        disabled={
          isLoading ||
          notificationTitle.trim() === '' ||
          notificationBody.trim() === '' ||
          (notificationType === 'one' && singleUser.trim() === '') ||
          (notificationType === 'list' && selectedUsers.length === 0)
        }
      >
        {isLoading ? 'Sending...' : 'Send Notification'}
      </StyledButton>
    </Container>
  );
};

export default SendNoti;
