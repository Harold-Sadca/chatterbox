import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

const mockUser = [
  'user1',
  'user2',
  'user3',
  'user4',
  'user5',
  'user6',
  'user7',
  'user8',
  'user9',
  'user10',
];

export default function Users() {
  return (
    <List sx={style} component='nav' aria-label='users'>
      {mockUser.map((user, idx) => {
        return (
          <div key={idx}>
            <ListItem button>
              <ListItemText primary={user} />
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );
}
