import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

window.localStorage.__proto__.getItem = jest.fn();
window.localStorage.__proto__.setItem = jest.fn();

beforeEach(() => {
  localStorage.clear();
});

test("renders", () => {
  render(<App />);
});

test("creates a new deck with a unique name", () => {
  render(<App />);
  const addButton = screen.getByText("Add New Deck");
  fireEvent.click(addButton);
  const input = screen.getByLabelText("Deck Name");
  fireEvent.change(input, { target: { value: "Unique Deck" } });
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);
  const deckNameElement = screen.getByText("Unique Deck", { selector: 'h5' });
  expect(deckNameElement).toBeInTheDocument();
});

test("saves the deck to local storage", () => {
  render(<App />);
  const addButton = screen.getByText("Add New Deck");
  fireEvent.click(addButton);
  const input = screen.getByLabelText("Deck Name");
  fireEvent.change(input, { target: { value: "Saved Deck" } });
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);
  expect(localStorage.setItem).toHaveBeenCalledWith(
    "decks",
    expect.stringContaining('"deckName":"Saved Deck"')
  );
});

test("loads decks from local storage on component mount", () => {
  const savedDecks = [{ deckName: "Loaded Deck", factions: [] }];
  jest.spyOn(localStorage, "getItem").mockReturnValue(JSON.stringify(savedDecks));
  render(<App />);
  const deckNameElement = screen.getByText("Loaded Deck", { selector: 'h5' });
  expect(deckNameElement).toBeInTheDocument();
});

test("shows only one deck per tab", () => {
  const savedDecks = [
    { deckName: "Deck 1", factions: [] },
    { deckName: "Deck 2", factions: [] },
  ];
  jest
    .spyOn(localStorage, "getItem")
    .mockReturnValue(JSON.stringify(savedDecks));
  render(<App />);
  expect(screen.getByRole('tab', { name: 'Deck 1' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Deck 2' })).toBeInTheDocument();
  expect(screen.getByText('Deck 1', { selector: 'h5' })).toBeInTheDocument();
});
