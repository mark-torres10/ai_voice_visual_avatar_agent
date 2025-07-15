import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatInterface from '../components/ChatInterface';
import * as api from '../lib/api';

const mockScript = 'This is a test AI response.';
const mockAudioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

jest.spyOn(api, 'generateAudio').mockImplementation(async () => ({
  script: mockScript,
  audioBase64: mockAudioBase64,
}));

describe('ChatInterface', () => {
  it('updates text and audio together after sending a message', async () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(mockScript)).toBeInTheDocument());
    // Audio player should have the correct src
    const audio = screen.getByTestId('audio-player') as HTMLAudioElement;
    expect(audio.src).toContain(mockAudioBase64);
  });

  it('plays audio and highlights bubble when AI response is clicked', async () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(mockScript)).toBeInTheDocument());
    const aiBubble = screen.getByText(mockScript).closest('div');
    // Simulate click
    fireEvent.click(aiBubble!);
    // Bubble should be highlighted (ring-2 class)
    expect(aiBubble).toHaveClass('ring-2');
    // Audio should play (simulate by checking src)
    const audio = screen.getByTestId('audio-player') as HTMLAudioElement;
    expect(audio.src).toContain(mockAudioBase64);
  });
}); 