import fs from 'fs/promises';
import path from 'path';

export class AudioProcessor {
  constructor(outputDirectory = 'public') {
    this.outputDir = outputDirectory;
  }

  async ensureDirectoryExists(directory) {
    try {
      await fs.access(directory);
    } catch (error) {
      await fs.mkdir(directory, { recursive: true });
    }
  }

  generateTimestampFilename(extension = 'mp3') {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}${minutes}${seconds}.${extension}`;
  }

  async saveAudioBuffer(audioBuffer, filename = null) {
    await this.ensureDirectoryExists(this.outputDir);
    
    const audioFilename = filename || this.generateTimestampFilename();
    const audioPath = path.join(this.outputDir, audioFilename);
    
    await fs.writeFile(audioPath, audioBuffer);
    
    return {
      filename: audioFilename,
      path: audioPath,
      size: audioBuffer.length
    };
  }

  async getAudioDuration(audioBuffer) {
    // Rough estimate: MP3 at 128kbps = ~16KB per second
    // This is a simple estimation - for precise duration you'd need audio analysis
    const estimatedDurationSeconds = Math.round(audioBuffer.length / 16000);
    return Math.max(1, estimatedDurationSeconds); // Minimum 1 second
  }

  async listAudioFiles() {
    try {
      await this.ensureDirectoryExists(this.outputDir);
      const files = await fs.readdir(this.outputDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.mp3') || file.endsWith('.wav')
      );
      
      return audioFiles.sort().reverse(); // Most recent first
    } catch (error) {
      console.error('Error listing audio files:', error);
      return [];
    }
  }

  async getMostRecentAudioFile() {
    const audioFiles = await this.listAudioFiles();
    return audioFiles.length > 0 ? audioFiles[0] : null;
  }
}