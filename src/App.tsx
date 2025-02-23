import React, { useState, useEffect } from "react";
import { Deck } from "./models/types";
import { deepCopyMasterTable } from "./models/masterData";
import DeckTab from "./components/DeckTab";
import { Container, Typography, Button, Box, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const App: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openAddDeckDlg, setOpenAddDeckDlg] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [editDeck, setEditDeck] = useState<Deck | null>(null);
  const [openEditDeckDlg, setOpenEditDeckDlg] = useState(false);
  const [editDeckName, setEditDeckName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const savedDecks = localStorage.getItem("decks");
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    }
  }, []);

  const handleAddDeck = () => {
    setOpenAddDeckDlg(true);
  };

  const handleCloseAddDeckDlg = () => {
    setOpenAddDeckDlg(false);
    setNewDeckName("");
  };

  const handleSave = () => {
    const deckName = newDeckName || "New Deck";
    const newDeck: Deck = {
      uuid: uuidv4(),
      deckName,
      factions: deepCopyMasterTable()
    };
    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    localStorage.setItem("decks", JSON.stringify(updatedDecks));
    setSelectedTab(updatedDecks.length - 1); // Automatically select the newly added tab
    handleCloseAddDeckDlg();
  };

  const handleEditDeck = (deck: Deck) => {
    setEditDeck(deck);
    setEditDeckName(deck.deckName);
    setOpenEditDeckDlg(true);
  };

  const handleCloseEditDeckDlg = () => {
    setOpenEditDeckDlg(false);
    setEditDeck(null);
    setEditDeckName("");
  };

  const handleSaveEdit = () => {
    if (editDeck) {
      const updatedDecks = decks.map((deck) =>
        deck.uuid === editDeck.uuid ? { ...deck, deckName: editDeckName } : deck
      );
      setDecks(updatedDecks);
      localStorage.setItem("decks", JSON.stringify(updatedDecks));
      handleCloseEditDeckDlg();
      setOpenSnackbar(true); // Show success notification
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" gutterBottom>
        Deck Tracker
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddDeck}>
        Add New Deck
      </Button>

      <Tabs value={selectedTab} onChange={handleChange} aria-label="deck tabs">
        {decks.map((deck, index) => (
          <Tab key={index} label={deck.deckName} />
        ))}
      </Tabs>

      <Box>
        {decks.map((deck, index) => (
          <div
            role="tabpanel"
            hidden={selectedTab !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            key={index}
          >
            {selectedTab === index && <DeckTab deck={deck} onEditDeck={handleEditDeck} />}
          </div>
        ))}
      </Box>

      <Dialog open={openAddDeckDlg} onClose={handleCloseAddDeckDlg}>
        <DialogTitle>Add New Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new deck.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Deck Name"
            type="text"
            fullWidth
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDeckDlg} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDeckDlg} onClose={handleCloseEditDeckDlg}>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new name for the deck.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Deck Name"
            type="text"
            fullWidth
            value={editDeckName}
            onChange={(e) => setEditDeckName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDeckDlg} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Deck edited successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
