export default {
  plugins: {
    tailwindcss: {},
    cssnano: process.env.NODE_ENV === "production" ? {} : false,
  },
}; 