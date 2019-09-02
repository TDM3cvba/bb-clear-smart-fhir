<template>
  <div class="notification is-danger">
    <strong v-if="error.statusText">{{error.statusText}}</strong>
    <strong v-else>{{error}}</strong>
    <br />
    <span v-if="errorDiagnostics">{{errorDiagnostics}}</span>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object
    }
  },
  computed: {
    errorDiagnostics() {
      if (this.error.responseJSON && this.error.responseJSON.issue) {
        return this.error.responseJSON.issue.map(i => i.diagnostics).join('; ');
      }
      return null;
    }
  }
};
</script>

<style>
</style>
