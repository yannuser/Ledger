import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      'User' : ' http://localhost:5000',
      'LearningGoal' : ' http://localhost:5000',
      'EffortRecord' : ' http://localhost:5000'
    }
  }
})
