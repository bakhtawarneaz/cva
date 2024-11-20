import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@unAuthPages': path.resolve(__dirname, 'src/pages/unAuthorized'),
      '@authPages': path.resolve(__dirname, 'src/pages/authorized'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@view': path.resolve(__dirname, 'src/view'),
      '@styles': path.resolve(__dirname, 'src/style'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@icon': path.resolve(__dirname, 'src/icons'),
      '@helper': path.resolve(__dirname, 'src/helpers'),
      '@slice': path.resolve(__dirname, 'src/redux/slices'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
  define: {
    global: {},
  },
})
