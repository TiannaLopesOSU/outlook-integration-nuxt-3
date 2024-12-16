<template>
  <div class="container my-3">
    <h1>Processing Login...</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    // Extract access token from URL fragment
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    const tokenType = hashParams.get("token_type");

    if (tokenType === "bearer" && accessToken) {
      console.log("Access Token:", accessToken);

      // Store access token in localStorage
      localStorage.setItem("outlookAccessToken", accessToken);

      // Redirect to the main page
      this.$router.push("/");
    } else {
      console.error("Invalid token type or access token not found");
    }
  },
};
</script>
