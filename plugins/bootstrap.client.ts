// plugins/bootstrap.client.ts
export default defineNuxtPlugin(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  });
  